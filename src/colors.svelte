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

    let root = document.documentElement;

    function updateTheme ( ) { 
        root.style.setProperty('--text-selection', Selection);

        root.style.setProperty('--background', Background);
    }

</script>

<style>
    :global(:root){
        --text-selection: #ffed50;

        --background: #191919;
        --surface: #232323;

    }

    :global( .testcolor ){
        background-color: var(--background) !important;
    }
</style>