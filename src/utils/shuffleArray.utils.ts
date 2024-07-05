const shuffleArray = <T>(array: T[]) => {
	const shuffledArray = [...array]
	let currentIndex = array.length

  while (currentIndex > 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

		const temp = shuffledArray[currentIndex]
		shuffledArray[currentIndex] = shuffledArray[randomIndex]
		shuffledArray[randomIndex] = temp
  }

	return shuffledArray
}

export default shuffleArray