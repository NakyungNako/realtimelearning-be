const Presentation = require("./presentationModel");

module.exports.createOne = async (title, author, code) => {
  try {
    const createdPre = await Presentation.create({
      title: title,
      author: author,
      slides: [
        {
          question: " ",
          answers: [
            { answer: "", correct: false },
            { answer: "", correct: false },
            { answer: "", correct: false },
          ],
        },
      ],
      presentationId: code,
    });
    return createdPre;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findOneById = async (preId) => {
  try {
    const foundPre = await Presentation.findById(preId);
    return foundPre;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.deleteOneById = async (preId) => {
  try {
    const deleted = await Presentation.deleteOne({
      _id: preId,
    });
    if (!deleted) {
      return {
        message: "something goes wrong when removing a group!",
      };
    } else return deleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
