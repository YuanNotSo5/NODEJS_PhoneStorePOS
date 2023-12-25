class errorController {
    
    //[GET]/400
    notFound (req, res) {
        res.render("error",{error: 404, error_content: "NOT FOUND"})
    };

    serverError = (req, res) => {
        res.type('text/plain');
        res.status(500);
        res.send('500 - Server Error');
    }
}
module.exports = new errorController;