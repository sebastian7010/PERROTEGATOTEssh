document.addEventListener('DOMContentLoaded', () => {
    const values = document.querySelectorAll('.values li');

    values.forEach(value => {
        value.addEventListener('mouseover', () => {
            value.style.backgroundColor = '#d0f0e0';
            value.style.transition = 'background-color 0.3s';
        });

        value.addEventListener('mouseout', () => {
            value.style.backgroundColor = '#f4f4f4';
        });
    });
});