const port = 3000;

module.exports = app => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
  
}