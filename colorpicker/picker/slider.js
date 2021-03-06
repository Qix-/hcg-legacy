(function () {
    "use strict";

    let css = `
.color-input {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 200px;
    height: 20px;
    padding: 0;
    background-color: transparent;
    background-origin: content-box;
    background-clip: content-box;
    border: solid 1px gray;
    outline: none;
}

.color-input::-webkit-slider-thumb
{
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-color: rgba(255, 255, 255, 0.75);
    width: 6px;
    height: 20px;
    border: solid 1px rgb(0, 0, 0);
    box-sizing: border-box;
}

.color-input::-moz-range-thumb
{
    border-radius: 0px;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-color: rgba(255, 255, 255, 0.75);
    width: 6px;
    height: 20px;
    border: solid 1px rgb(0, 0, 0);
    box-sizing: border-box;
}

.color-input::-webkit-slider-runnable-track
{
    background-color: transparent;
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
}

.color-input::-moz-range-track
{
    background-color: transparent;
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
}
    `;

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = css;
document.querySelectorAll("head")[0].appendChild(style);

    const H = 0;
    const C = 1;
    const G = 2;

    Math.clamp = function (num, min, max) {
        return Math.max(min, Math.min(num, max));
    }

    function _strc(a) {
        return `rgb(${Math.round(a[0]) }, ${Math.round(a[1]) }, ${Math.round(a[2]) })`;
    }

    function _strh(a) {
        return `hcg(${Math.round(a[0] * 360) }, ${Math.round(a[1] * 100) }%, ${Math.round(a[2]*100) }%)`;
    }

    function _color(hcg, func) {
        return (func || hcg2rgb)([hcg[0] * 360, hcg[1] * 100, hcg[2] * 100]);
    }

    function _pleft(el) {
        var c = getComputedStyle(el, "");
        var pd = parseInt(c.paddingLeft);
        var bd = parseInt(c.borderLeftWidth);
        return pd + bd;
    }

    function _ptop(el) {
        var c = getComputedStyle(el, "");
        var pd = parseInt(c.paddingTop);
        var bd = parseInt(c.borderTopWidth);
        return pd + bd;
    }

    function _pwidth(el) {
        var c = getComputedStyle(el, "");
        var pd = parseInt(c.paddingLeft) + parseInt(c.paddingRight);
        return el.clientWidth - pd;
    }

    function _pheight(el) {
        var c = getComputedStyle(el, "");
        var pd = parseInt(c.paddingTop) + parseInt(c.paddingBottom);
        return el.clientHeight - pd;
    }

    function mod(a, n) {
        return ((a % n) + n) % n;
    }

    function _set(a, b, o){
        o = o || 0;
        for(let i=0;i<b.length;i++){
            a[i + o] = b[i];
        }
    }

    class Slider {
        constructor(){
            this.input = document.createElement("input");
            this.channel = H;
            this.gcount = 2;
            this.hcg = [0, 1, 1];
            this.min = 0;
            this.max = 1;
            this.init();

            {
                let input = this.input;
                let self = this;
                input.classList.add("color-input");
                input.addEventListener("input", function(){
                    self.hcg[self.channel] = this.value;
                    if (self.onchange) { self.onchange(); }
                    self.draw();
                });
            }
        }

        init(){
            let input = this.input;
            input.type = "range";
            input.min = this.min;
            input.max = this.max;
            input.step = (this.max - this.min) * 0.0001;
            input.value = this.hcg[this.channel];
            this.draw();
            return this;
        }

        draw(){
            var head = "linear-gradient";
            var path = [];

            for(let i=0;i<this.gcount;i++){
                var hcg = Array.from(this.hcg);
                var perc = i / (this.gcount-1);
                hcg[this.channel] = this.min + (this.max - this.min) * perc;
                path.push(`${_strc(_color(hcg, this.func))} ${(perc * 100).toFixed(2)}%`);
            }

            var str = `${head}(to right, ${path.join(",")})`;
            this.input.style.backgroundImage = str;
            return this;
        }

        synchronize(hcg){
            _set(this.hcg, hcg);
            this.input.value = this.hcg[this.channel];
            this.draw();
            return this;
        }

        appendTo(element){
            element.appendChild(this.input);
            return this;
        }
    }

    class HueSlider extends Slider {
        constructor(){
            super();
            this.func = hcg2rgb;
            this.gcount = 7;
            this.channel = H;
            this.init();
        }
    }

    class ChromaSlider extends Slider {
        constructor(){
            super();
            this.func = hcg2rgb;
            this.channel = C;
            this.init();
        }
    }

    class GraySlider extends Slider {
        constructor(){
            super();
            this.func = hcg2rgb;
            this.channel = G;
            this.init();
        }
    }

    this.Slider = Slider;
    this.HueSlider = HueSlider;
    this.ChromaSlider = ChromaSlider;
    this.GraySlider = GraySlider;

}).call(this);