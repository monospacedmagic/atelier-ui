<script>

    // Refer to the Anatomy page of Material Design for guidance on propper color usage/placment.
    // https://material.io/design/color/dark-theme.html#anatomy

    let Selection = '#ffed50'

    let Background = '#191919';
    let Surface = '#232323';
    let Primary = '#bd88f6';
    let Secondary = '#00d8c6';
    let OnBackground = '#fff';
    let OnSurface = '#fff';
    let OnPrimary = '#000';
    let OnSecondary = '#000';

    let style = document.documentElement.style;

    function updateTheme ( ) { 
        style.setProperty('--text-selection', Selection);

        style.setProperty('--background', Background);
        style.setProperty('--surface', Surface);
        style.setProperty('--primary', Primary);
        style.setProperty('--secondary', Secondary);
        style.setProperty('--on-background', OnBackground);
        style.setProperty('--on-surface', OnSurface);
        style.setProperty('--on-primary', OnPrimary);
        style.setProperty('--on-secondary', OnSecondary);
    }

</script>

<style>
    :global(:root){
        --text-selection: #ffed50;

        --background: #191919;
        --surface: #232323;
        --primary: #bd88f6;
        --secondary: #00d8c6;
        --on-background: #fff;
        --on-surface: #fff;
        --on-primary: #000;
        --on-secondary: #000;
    }

    :global( .testcolor ){
        background-color: var(--background) !important;
    }
</style>