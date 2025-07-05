const clsReview = require("../model/clsReview.model");


    const createReview = async (req, res, newData) => {

        console.log('review data : ', newData);

        try {
            
            const review = await clsReview.createReview(JSON.parse(newData));

            console.log("???????? ", review);

            if(review){

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(review));
            }else{

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }

        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error !!' }));
        }
    }

    const getReviews = async (req, res, userId) => {

        console.log('review userId : ', userId);

        try {
            
            const review = await clsReview.getReviews(userId);

            if(review){

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(review));
            }else{

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not found' }));
            }

        } catch (error) {
            
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error !!' }));
        }
    }


module.exports = {

    createReview,
    getReviews
}

    