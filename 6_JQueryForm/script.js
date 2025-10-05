$(function() {
    $("#signupform").on("submit", function(e) {
        e.preventDefault() ;
        let valid = true ;

        $(".error-msg").text("") ;
        $("#success-message").text("") ;

        const name = $("#name").val().trim() ;
        const email = $("#email").val().trim() ;
        const password = $("#password").val() ;
        const confPassword = $("#confirm-password").val() ;
        const termsChecked = $("#terms").is(":checked") ;


        if (name === "") {
            $("#name").next(".error-msg").text("Full name is required.") ;
            valid = false ;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;

        if (email === "") {
            $("#email").next(".error-msg").text("Email is required.") ;
            valid = false ;

        } else if (!emailPattern.test(email)) {
            $("#email").next(".error-msg").text("Enter valid email address.") ;
            valid = false ;
        }


        if (password === "") {
            $("#password").next(".error-msg").text("Password is required.") ;
            valid = false ;
             
        } else if (password.length < 8) {
            $("#password").next(".error-msg").text("Password length must be at least 8 characters.") ;
            valid = false ;
        }

        if (confPassword === "") {
            $("#confirm-password").next(".error-msg").text("Confirm your password.") ;
            valid = false ;
             
        } else if (password != confPassword) {
            $("#confirm-password").next(".error-msg").text("Passwords don't match.") ;
            valid = false ;
        }

        if (!termsChecked) {
            $("#terms").parent().next(".error-msg").text("You must agree to the terms.") ;
            valid = false;
        }

        if (valid) {
            $("#success-message").text("Sign-up successful!") ;
            $("#signupform")[0].reset() ;
        }
    })
})