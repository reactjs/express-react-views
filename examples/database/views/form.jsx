var React = require('react');
function Form(props){
    return(
        <form action="/" method="POST">
        <span className="components">
        <label for="customername">Enter your name: </label>
        <input type="text" name="customername" />
        </span>
        <span className="components">
        <label for="productname">Product Name: </label>
        <input type="text" name="productname" />
        </span>
        <span className="components">
        <label for="reviews">Your reviews: </label>
        <textarea name="reviews" id="" cols="30" rows="10"></textarea>
        </span>
        <button className="btn">Submit</button>
    </form>

    )
}
module.exports = Form;