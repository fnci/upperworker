/* function that return a function and execute that function an passes their error to catches by next if
there's an error. We use this to wrap our asynchronous
functions*/
export default fn => {
    return (req, res, next) =>{
        fn(req, res, next).catch(next);
    }
};