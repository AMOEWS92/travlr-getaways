/* GET Homepage */
const index = (req, res) => {
  res.render('index', { title: 'Travlr Getaways' });
};

exports.index = (req, res) => {
  res.render('index', { title: 'Travlr Getaways' });
};

module.exports = { index };