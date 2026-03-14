
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User, ExamResult, Course, Exam, News } from '../types';

export const dbService = {
  // AUTH: SIGN UP
  async signUp(email: string, password: string, userData: Partial<User>) {
    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase not configured, using local fallback");
      return { user: { id: `usr-${Date.now()}`, ...userData }, error: null, session: { access_token: 'mock' } };
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'student',
            nid: userData.nid
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Map camelCase to snake_case for database
        const dbUser = {
          id: data.user.id,
          name: userData.name,
          email: email,
          role: userData.role || 'student',
          nid: userData.nid,
          gender: userData.gender,
          dob: userData.dob,
          level: userData.level,
          grade: userData.grade,
          stream: userData.stream,
          school: userData.school,
          phone_number: userData.phoneNumber,
          address: userData.address,
          salary: userData.salary,
          points: userData.points || 0,
          joined_date: new Date().toISOString(),
          preferred_language: userData.preferredLanguage || 'en',
          photo: userData.photo,
          status: 'active'
        };

        const { error: syncError } = await supabase
          .from('users')
          .upsert(dbUser);
        
        if (syncError) {
          console.error("Error syncing user profile to database:", syncError);
        }
      }
      
      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      console.error("Registration Error:", err.message);
      return { user: null, session: null, error: err };
    }
  },

  // AUTH: SIGN IN
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback for local demo handled in App.tsx
      return { user: null, error: new Error("Supabase not configured") };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
  },

  // FETCH USER PROFILE
  async fetchUserProfile(userId: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return error ? null : data;
  },

  // SYNC USER DATA
  async syncUser(user: User) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .upsert({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        points: user.points,
        role: user.role,
        grade: user.grade,
        stream: user.stream,
        level: user.level,
        nid: user.nid,
        gender: user.gender,
        dob: user.dob,
        school: user.school,
        phone_number: user.phoneNumber,
        address: user.address,
        salary: user.salary,
        photo: user.photo,
        preferred_language: user.preferredLanguage,
        completed_lessons: user.completedLessons,
        completed_exams: user.completedExams,
        completed_courses: user.completedCourses,
        certificates_paid: user.certificatesPaid,
        last_sync: new Date().toISOString()
      });
    if (error) console.warn("Supabase Sync Warning:", error.message);
    return data;
  },

  // DELETE USER
  async deleteUser(id: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) console.warn("User Delete Error:", error.message);
  },

  // FETCH USERS (LEADERBOARD)
  async fetchTopStudents() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('points', { ascending: false })
      .limit(10);
    return error ? [] : data;
  },

  // SYNC EXAM DATA
  async syncExam(exam: Exam) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('exam')
      .upsert({
        id: exam.id,
        title: exam.title,
        course_code: exam.courseCode,
        grade: exam.grade,
        stream: exam.stream,
        academic_year: exam.academicYear,
        duration_minutes: exam.durationMinutes,
        total_points: exam.totalPoints,
        status: exam.status,
        type: exam.type,
        subject: exam.subject,
        categories: exam.categories,
        questions: exam.questions,
        semester: exam.semester
      });
    if (error) console.warn("Exam Sync Error:", error.message);
    return data;
  },

  // FETCH EXAMS
  async fetchExams() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('exam')
      .select('*')
      .eq('status', 'published');
    return error ? [] : data;
  },

  // FETCH COURSES
  async fetchCourses() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    return error ? [] : data;
  },

  // FETCH NEWS
  async fetchNews() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });
    return error ? [] : data;
  },

  // SYNC EXAM RESULTS
  async saveExamResult(result: ExamResult) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('exam_results')
      .insert({
        exam_id: result.examId,
        student_id: result.studentId,
        score: result.score,
        total_points: result.totalPoints,
        category_breakdown: result.categoryBreakdown,
        time_spent: result.timeSpentSeconds,
        completed_at: result.completedAt,
        answers: result.answers
      });
    if (error) console.warn("Result Persistence Error:", error.message);
    return data;
  },

  // SYNC COURSE DATA
  async syncCourse(course: Course) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('courses')
      .upsert({
        id: course.id,
        title: course.title,
        code: course.code,
        grade: course.grade,
        stream: course.stream,
        level: course.level,
        thumbnail: course.thumbnail,
        description: course.description,
        lessons: course.lessons,
        instructor: course.instructor,
        subject: course.subject
      });
    if (error) console.warn("Course Sync Error:", error.message);
    return data;
  },

  // DELETE COURSE
  async deleteCourse(id: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    if (error) console.warn("Course Delete Error:", error.message);
  },

  // SYNC NEWS DATA
  async syncNews(news: News) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('news')
      .upsert({
        id: news.id,
        title: news.title,
        summary: news.summary,
        content: news.content,
        tag: news.tag,
        image: news.image,
        date: news.date
      });
    if (error) console.warn("News Sync Error:", error.message);
    return data;
  },

  // DELETE NEWS
  async deleteNews(id: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    if (error) console.warn("News Delete Error:", error.message);
  },

  // FETCH PERFORMANCE HISTORY
  async fetchResults(userId: string) {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')
      .eq('student_id', userId);
    return error ? [] : data;
  },

  // FETCH ALL RESULTS (Admin)
  async fetchAllResults() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')
      .order('completed_at', { ascending: false });
    return error ? [] : data;
  }
};
