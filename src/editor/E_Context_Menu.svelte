<script>
    if (document.getElementById('test1').addEventListener) {
        document.getElementById('test1').addEventListener('contextmenu', function(e) {
                $("#rmenu").toggleClass("hide");
                $("#rmenu").css(
                {
                    position: "absolute",
                    top: e.pageY,
                    left: e.pageX
                }
                );
                e.preventDefault();
        }, false);
    }

    // this is from another SO post...  
    $(document).bind("click", function(event) {
    document.getElementById("rmenu").className = "hide";
    });
</script>


<div class="hide" id="rmenu">
<ul>
    <li>White</li>
    <li>Green</li>
    <li>Yellow</li>
    <li>Orange</li>
    <li>Red</li>
    <li>Blue</li>
</ul>
</div>


<style>
    .hide {
        display: none;
    }
</style>