function isModern() {
    var isModern = false;
    try {
                eval('var foo = {}; var bar = foo?.baz;');
	    	isModern = true;
            } catch (e) {
                isModern = false;
            }
    var script = document.createElement('script');
    if (isModern) {
        script.src = 'static/script.js';
    } else {
        script.src = 'static/backwards_compat/es5_script.js';
    }
    document.body.appendChild(script);
}
isModern();
