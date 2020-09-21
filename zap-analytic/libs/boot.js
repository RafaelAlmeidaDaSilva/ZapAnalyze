const port = 3001;

module.exports = app => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
  
}