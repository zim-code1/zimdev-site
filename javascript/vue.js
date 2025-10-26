document.addEventListener("DOMContentLoaded", () => {
  if (typeof Vue !== 'undefined') {
    const { createApp } = Vue;

    createApp({
      data() {
        return {
          isSubmitted: false,
          modalOpen: false,
          formStatus: '',
          submittedName: '',
          formName: '',
          formEmail: '',
          formMessage: ''
        }
      },
      methods: {
        openModal() {
          this.modalOpen = true;
          document.body.style.overflow = 'hidden';
        },
        closeModal() {
          this.modalOpen = false;
          this.formStatus = '';
          document.body.style.overflow = '';
        },
        async submitForm() {
          this.formStatus = 'Sending...';
          const formData = new FormData();
          formData.append('name', this.formName);
          formData.append('email', this.formEmail);
          formData.append('message', this.formMessage);
          
          try {
            const response = await fetch('https://formspree.io/f/xdkpobvv', {
              method: 'POST',
              body: formData,
              headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
              this.submittedName = this.formName;
              this.isSubmitted = true;
              this.formStatus = 'Thanks! Your message was sent.';
              this.formName = '';
              this.formEmail = '';
              this.formMessage = '';
              setTimeout(() => {
                this.closeModal();
              }, 2000);
            } else {
              this.formStatus = 'Oops! There was a problem.';
            }
          } catch (error) {
            this.formStatus = 'Error. Please try again.';
          }
        }
      }
    }).mount('#contact-app');
  
  } else {
    console.error("Vue.js did not load. The contact form will not work.");
  }
});