axios.get("/apis/auth/login").then(
    function(response){
        if(response.data == 'Already login') {
            window.location.href = '/';
        }
    }
).catch(function (error) {
    console.log(error);
})