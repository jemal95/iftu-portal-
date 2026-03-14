
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div 
      onClick={() => onClick(course)}
      className="bg-white rounded-[3.5rem] border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer overflow-hidden flex flex-col h-full active:scale-[0.98]"
    >
      <div className="h-56 relative border-b-8 border-black">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute top-6 left-6">
          <span className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-white">{course.grade}</span>
        </div>
      </div>
      <div className="p-10 flex flex-col flex-1 space-y-6">
        <div>
          <span className="text-xs font-black uppercase text-blue-500 tracking-[0.3em]">{course.code}</span>
          <h3 className="text-3xl font-black uppercase tracking-tight leading-none mt-2">{course.title}</h3>
        </div>
        <p className="text-gray-400 font-bold leading-relaxed line-clamp-3">{course.description}</p>
        <div className="pt-6 border-t-4 border-black flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gray-100 rounded-2xl border-2 border-black flex items-center justify-center font-black">
               {course.instructor.charAt(0)}
             </div>
             <div className="leading-tight">
               <p className="text-[10px] font-black uppercase text-gray-400">Teacher</p>
               <p className="font-black text-sm">{course.instructor.split(' ')[0]}</p>
             </div>
          </div>
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl border-4 border-black flex items-center justify-center">→</div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
