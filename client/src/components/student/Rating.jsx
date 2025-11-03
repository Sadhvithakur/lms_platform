import React, { useState, useEffect } from 'react'

const Rating = ({ initialRating, onRate }) => {

    const [rating, setRating] = useState(initialRating || 0)

    const handleRating = (value) => {
        setRating(value);
        if (onRate) onRate(value);
    }

    useEffect(() => {
        if (typeof initialRating === 'number') {
            setRating(initialRating);
        }
    }, [initialRating])

    return (
        <div role="group" aria-label="rating">
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                return (
                    <span
                        key={index}
                        className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                        onClick={() => handleRating(starValue)}
                        aria-label={`Rate ${starValue}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRating(starValue) }}
                    >
                        &#9733;
                    </span>
                )
            })}
        </div>
    )
}

export default Rating
