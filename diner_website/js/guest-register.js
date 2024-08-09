// Assuming basic functionality for booking now and logging form values
document.addEventListener('DOMContentLoaded', function() {
    const bookNowBtn = document.querySelector('.booknowbtn');
    const signUpBtn = document.querySelector('.signupbtn');

    bookNowBtn.addEventListener('click', () => {
        const firstName = document.querySelector('.firstname').value;
        const lastName = document.querySelector('.lastname').value;
        const phone = document.querySelector('.phonenumber').value;
        const email = document.querySelector('.email').value;

        console.log(`Booking details: ${firstName} ${lastName}, Phone: ${phone}, Email: ${email}`);
        // Implement API call or form submission logic here
    });

    signUpBtn.addEventListener('click', () => {
        // Redirect to the signup page or handle signup logic
        window.location.href = 'signup.html';
    });
});