$(function() {
    var $html = $('#htmlPanel') ;
    var $css = $('#cssPanel') ;
    var $js = $('#jsPanel') ;
    var iframe = document.getElementById('outputFrame') ;

    function debounce(fn, wait) {
        var t ;

        return function() {
            var args = arguments, ctx = this ;
            clearTimeout(t) ;
            t = setTimeout(function() {
                fn.apply(ctx, args) ;
            }, wait) ;
        };
    }

    function updateOutput() {
        var htmlContent = $html.val() || '' ;
        var cssContent = $css.val() || '' ;
        var jsContent = $js.val() || '' ;   

        var doc = iframe.contentDocument || iframe.contentWindow.document ;

        var base = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
        base += '<style>' + cssContent + '</style></head><body>' + htmlContent + '</body></html>';

        doc.open() ;
        doc.write(base) ;
        doc.close() ;

        try {
            var script = doc.createElement('script') ;
            script.type = 'text/javascript' ;
            script.text = jsContent ;
            doc.body.appendChild(script) ;

        } catch (err) {
            console.error('Failed to inject script into iframe', err) ;
        }
    }

    var debounceUpdate = debounce(updateOutput, 250) ;

    $html.on('input', debounceUpdate) ;
    $css.on('input', debounceUpdate) ;
    $js.on('input', debounceUpdate) ;

    updateOutput() ;
})