import React from 'react'
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContex'
import Loading from '../../components/student/Loading'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'


const CourseDetails = () => {

    const { id } = useParams();

    const [courseData, setCourseData] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(true);
    const [previewVideoId, setPreviewVideoId] = useState(null);

    const { allCourses, calculateRating, calculateChapterTime, currency, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            const findCourse = Array.isArray(allCourses) ? allCourses.find(course => course._id === id) : null
            setCourseData(findCourse || null);
        }

        fetchCourseDetails()
    }, [id, allCourses])

    const toggleSection = (index) => {
        setOpenSections(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    if (!courseData) return <Loading />

    return (
        <>
            <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>

                <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/100'></div>

                {/* left column */}
                <div className='max-w-xl z-10 text-gray-500'>
                    <h1 className='text-course-details-heading-large font-semibold text-gray-800'>{courseData.courseTitle}</h1>

                    {/* short description */}
                    <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{ __html: (courseData.courseDescription || '').slice(0, 200) }} />

                    {/* review section - moved under description */}
                    <div className='flex items-center space-x-3 mt-4 pt-3 pb-1 text-sm'>
                        <p className='font-semibold text-gray-800'>{calculateRating(courseData)}</p>
                        <div className='flex'>
                            {[...Array(5)].map((_, i) => (
                                <img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt=''
                                    className='w-3.5 h-3.5' />
                            ))}
                        </div>
                        <p className='text-blue-600'>({courseData.courseRatings?.length || 0} {courseData.courseRatings && courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>

                        <p>{courseData.enrolledStudents?.length || 0} {courseData.enrolledStudents && courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
                    </div>

                    <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educator?.name || 'Sadhtech'}</span></p>

                    <div className='pt-8 text-gray-800'>  </div>
                    <h2 className='text-xl font-semibold' >Course Structure</h2>
                    <div className='pt-5'>
                        {Array.isArray(courseData.courseContent) && courseData.courseContent.map((chapter, index) => (
                            <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                                <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                                    <div className='flex items-center gap-2'>
                                        <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow icon" />
                                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                                    </div>
                                    <p className='text-sm md:text-default'>{(Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0)} Lectures - {calculateChapterTime(chapter)}</p>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                                        {Array.isArray(chapter.chapterContent) && chapter.chapterContent.map((lecture, i) => (
                                            <li key={i} className='flex items-start gap-2 py-1'>
                                                <img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1' />
                                                <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                                    <p>{lecture.lectureTitle}</p>
                                                    <div className='flex gap-2'>
                                                        {lecture.isPreviewFree && (
                                                            <button
                                                                type='button'
                                                                onClick={() => {
                                                                    const vid = (lecture.lectureUrl && lecture.lectureUrl.split('/').pop()) || lecture.videoId || lecture.lectureVideoId || lecture.youtubeId || null;
                                                                    if (!vid) return;
                                                                    setPreviewVideoId(prev => prev === vid ? null : vid);
                                                                }}
                                                                className='text-blue-500 cursor-pointer underline text-sm'
                                                            >
                                                                Preview
                                                            </button>
                                                        )}
                                                        <p>{humanizeDuration((Number(lecture.lectureDuration) || 0) * 60 * 1000, { units: ['h', 'm'] })}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* full description at bottom */}
                    <div className='py-20 text-sm md:text-default'>
                        <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
                        <p className='pt-3 rich-text ' dangerouslySetInnerHTML={{ __html: (courseData.courseDescription || '') }} />
                    </div>
                </div>

                {/* right column - course card (hero + bottom) */}
                <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
                    <div className='course-card-hero'>
                        {previewVideoId ? (
                            <div className='w-full aspect-video relative'>
                                <iframe
                                    src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1&modestbranding=1&rel=0`}
                                    title='Course preview'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                    allowFullScreen
                                    className='w-full h-full'
                                />

                                {/* small close button */}
                                <button
                                    type='button'
                                    onClick={() => setPreviewVideoId(null)}
                                    className='absolute top-2 right-2 bg-black/50 text-white rounded px-2 py-1 text-xs'
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <img src={courseData.courseThumbnail} alt="course thumbnail" className='course-card-img' />
                                <div className='course-card-overlay' />

                                {/* badge (use category initials if available) */}
                                <div className='absolute top-4 left-4'>
                                    <div className='course-card-badge'>
                                        {(courseData.category || 'JS').toString().slice(0, 2).toUpperCase()}
                                    </div>
                                </div>

                                {/* title + subtitle strip anchored to bottom */}
                                <div className='absolute bottom-4 left-4 right-4'>
                                    <h3 className='course-card-title'>{courseData.courseTitle}</h3>
                                    <div className='course-card-subtitle'>{courseData.courseSubtitle || 'Introduction and 1st program'}</div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className='course-card-bottom'>
                        <div className='flex items-center gap-3 text-sm text-red-500'>
                            <img className='w-4' src={assets.time_left_clock_icon} alt="time left icon" />
                            <p>5 days <span className='text-gray-600'>left at this price!</span></p>
                        </div>

                        <div className='mt-3 flex items-end justify-between'>
                            <div>
                                <div className='text-2xl md:text-3xl font-bold text-gray-900'>{currency} {(courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)}</div>
                                <div className='text-sm text-gray-500 line-through'>{currency} {courseData.coursePrice}</div>
                            </div>
                            <div className='text-sm text-gray-700'>{courseData.discount}% off</div>
                        </div>

                        <div className='mt-4 flex items-center text-sm text-gray-600 gap-4 course-card-stats'>
                            <div className='flex items-center gap-2'>
                                <img src={assets.star} alt='star' />
                                <span className='text-orange-500'>{calculateRating(courseData)}</span>
                            </div>

                            <div className='h-4 w-px bg-gray-300'></div>

                            <div className='flex items-center gap-2'>
                                <img src={assets.time_clock_icon} alt='time' />
                                <span>{calculateCourseDuration(courseData)}</span>
                            </div>

                            <div className='h-4 w-px bg-gray-300'></div>

                            <div className='flex items-center gap-2'>
                                <img src={assets.lesson_icon} alt='lessons' />
                                <span>{calculateNoOfLectures(courseData)} lessons</span>
                            </div>
                        </div>

                        <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 
                    text-white font-medium'>
                            {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}</button>
                        <div className='pt-6'>
                            <p className='md:text-xl text-lg font-medium text-gray-800'>whats in the course</p>
                            <ul className='ml-4 pt-2 text-sm md:text-default list-disc 
                text-gray-500'>
                                <li>Life time access with free updates. </li>
                                <li>step by step guidance.</li>
                                <li>Quizzes and assignments.</li>
                                <li>Access to exclusive resources.</li>
                                <li>Certificate of completion.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    )

}

export default CourseDetails
