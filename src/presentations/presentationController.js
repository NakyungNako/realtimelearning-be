const {
  addPresentation,
  deletePresentation,
} = require("../groups/groupService");
const {
  createOne,
  findOneById,
  deleteOneById,
} = require("./presentationService");
const randomstring = require("randomstring");

module.exports.createNewPre = async (req, res) => {
  try {
    const preCode = randomstring.generate({
      length: 8,
      charset: "numeric",
    });
    const newPre = await createOne(req.body.title, req.body.author, preCode);
    const exportGroup = await addPresentation(req.body.groupId, newPre.id);
    if (exportGroup) return res.status(200).json(exportGroup);
    return res.status(400).json({ message: "cannot create new presentation" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.findPreById = async (req, res) => {
  try {
    const preId = req.query.id;
    const foundPre = await findOneById(preId);
    if (foundPre) return res.status(200).json(foundPre);
    return res.status(200).json({ message: "cannot find Presentation" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.deletePre = async (req, res) => {
  try {
    const preId = req.body.id;
    const removedPre = await deleteOneById(preId);
    if (removedPre.deletedCount === 1) {
      const exportGroup = await deletePresentation(req.body.groupId, preId);
      if (exportGroup) return res.status(200).json(exportGroup);
    } else return res.status(400).json(removedPre);
  } catch (error) {}
};

module.exports.addSlideToPre = async (req, res) => {
  try {
    const preId = req.body.id;
    const foundPre = await findOneById(preId);
    const newSlides = foundPre.slides;
    newSlides.push({
      question: " ",
      answers: [
        { answer: "", correct: false, total: 0 },
        { answer: "", correct: false, total: 0 },
        { answer: "", correct: false, total: 0 },
      ],
    });
    foundPre.slides = newSlides;
    await foundPre.save();
    const newPre = await findOneById(preId);
    return res.status(200).json(newPre);
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateSlides = async (req, res) => {
  try {
    const { preId, slides } = req.body;
    const foundPre = await findOneById(preId);
    foundPre.slides = slides;
    await foundPre.save();
    const newPre = await findOneById(preId);
    return res.status(200).json(newPre);
  } catch (error) {
    console.log(error);
  }
};

module.exports.updatePresent = async (req, res) => {
  try {
    const { preId, present } = req.body;
    const foundPre = await findOneById(preId);
    foundPre.title = present.title;
    foundPre.author = present.author;
    foundPre.slides = present.slides;
    await foundPre.save();
    const newPre = await findOneById(preId);
    if (newPre) return res.status(200).json({ message: "save successfully!" });
  } catch (error) {
    console.log(error);
  }
};
