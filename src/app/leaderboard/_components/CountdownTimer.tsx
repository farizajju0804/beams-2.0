import React from 'react'

interface TimeUnit {
  value: number
  label: string
}

interface CountdownTimerProps {
  timeRemaining: number
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeRemaining }) => {
  const formatTime = (time: number): TimeUnit[] => {
    const days = Math.floor(time / (24 * 60 * 60))
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((time % (60 * 60)) / 60)
    const seconds = time % 60

    return [
      { value: days, label: 'Days' },
      { value: hours, label: 'Hours' },
      { value: minutes, label: 'Minutes' },
      { value: seconds, label: 'Seconds' }
    ]
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-2">
      <div className="flex flex-wrap justify-center gap-4  md:gap-8">
        {formatTime(timeRemaining).map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center bg-background rounded-2xl shadow-defined mb-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-text">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-grey-2">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}