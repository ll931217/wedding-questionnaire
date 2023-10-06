export const Answers = ({ answers, correctAnswer }) => {
    const selectAnswer = (i) => {
        if (i === correctAnswer) {
            console.log("correct");
        } else {
            console.log("incorrect");
        }
    };
    return (
        <>
            <div className="grid grid-cols-2 gap-5">
                {answers
                    ? answers.map((answer, i) => (
                        <a
                            onClick={() => selectAnswer(i)}
                            key={i}
                            className="bg-white border-2 border-gray-400 rounded-md shadow-lg text-center flex justify-center items-center w-40 h-40 p-2"
                        >
                            <div>{answer}</div>
                        </a>
                    ))
                    : null}
            </div>
        </>
    );
};
