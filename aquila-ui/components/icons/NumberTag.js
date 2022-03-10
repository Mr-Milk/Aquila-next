const NumberTag = ({number, width, height, ...props}) => {
    return (
        <svg viewBox="0 0 100 100" width={width} height={height} {...props}>
            <circle cx="50" cy="50" r="50" fill="#ff9800"/>
            <text x="50%" y="67%" fill="white" textAnchor="middle" fontSize="3em">{number}</text>
        </svg>
    )
}

export default NumberTag;