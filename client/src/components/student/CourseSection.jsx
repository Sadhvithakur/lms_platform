import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'
import { AppContext } from '../../context/AppContex'

const CourseSection = () => {

    const { allCourses } = useContext(AppContext) || { allCourses: [] }
    return (
        <div className='py-16 md:px-40 px-8'>
            <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
            <p className='text-sm md:text-base text-gray-500 mt-3'> Discover our top-rated
                courses across various categories. <br />
                From programming to design, we have something for everyone.
            </p>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 px-4 md:px-0 my-10 md:my-16">
                {allCourses.slice(0, 4).map((course, index) => <CourseCard key={index} course={course} />)}
            </div>
            <Link to={'/course-list'} onClick={() => scrollTo(0, 0)}
                className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded'> View all courses

            </Link>
        </div>
    )
}

export default CourseSection
