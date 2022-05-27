import React from 'react'

export const Diamond = ({ width, height }: any) => {
    const hw = Math.floor(width / 2)
    const hh = Math.floor(height / 2)
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={`M2 ${hw}L${hh} 2L${height-2} ${hw}L${hh} ${width-2}L2 ${hh}Z`} stroke="#001819" stroke-width="2" />
        </svg>
    )
}
