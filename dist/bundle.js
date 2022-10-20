"use strict";function t(t,e,r,n){return new(r=r||Promise)((function(a,i){function o(t){try{c(n.next(t))}catch(t){i(t)}}function s(t){try{c(n.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?a(t.value):((e=t.value)instanceof r?e:new r((function(t){t(e)}))).then(o,s)}c((n=n.apply(t,e||[])).next())}))}function e(t,e){var r,n,a,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},o={next:s(0),throw:s(1),return:s(2)};return"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){var c=[o,s];if(r)throw new TypeError("Generator is already executing.");for(;i;)try{if(r=1,n&&(a=2&c[0]?n.return:c[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,c[1])).done)return a;switch(n=0,(c=a?[2&c[0],a.value]:c)[0]){case 0:case 1:a=c;break;case 4:return i.label++,{value:c[1],done:!1};case 5:i.label++,n=c[1],c=[0];continue;case 7:c=i.ops.pop(),i.trys.pop();continue;default:if(!(a=0<(a=i.trys).length&&a[a.length-1])&&(6===c[0]||2===c[0])){i=0;continue}if(3===c[0]&&(!a||c[1]>a[0]&&c[1]<a[3]))i.label=c[1];else if(6===c[0]&&i.label<a[1])i.label=a[1],a=c;else{if(!(a&&i.label<a[2])){a[2]&&i.ops.pop(),i.trys.pop();continue}i.label=a[2],i.ops.push(c)}}c=e.call(t,i)}catch(s){c=[6,s],n=0}finally{r=a=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}}var r=function(){function r(t){var e=t.db,r=t.max,n=t.duration,a=t.namespace;t=t.error;this.db=e,this.max=r,this.duration=n,this.namespace=a,this.error=t}return r.prototype.set=function(r){return t(this,void 0,void 0,(function(){var t,n;return e(this,(function(e){switch(e.label){case 0:return t="".concat(this.namespace,":").concat(r),n=Date.now(),[4,this.db.zcard(this.namespace)];case 1:return e.sent(),[4,this.db.zadd(t,n,n)];case 2:return e.sent(),[4,this.db.ttl(t)];case 3:return e.sent()<=-1?[4,this.db.pexpire(t,this.duration)]:[3,5];case 4:e.sent(),e.label=5;case 5:return[2]}}))}))},r.prototype.get=function(r){return t(this,void 0,void 0,(function(){var t;return e(this,(function(e){switch(e.label){case 0:return t="".concat(this.namespace,":").concat(r),[4,this.db.zrange(t,0,-1)];case 1:return e.sent().length<this.max?[4,this.set(r)]:[3,3];case 2:return[2,e.sent()];case 3:throw new Error("".concat(this.duration,"内超过最大限制").concat(this.max))}}))}))},r}(),n=function(){function t(t){var e=t.db,r=t.max,n=t.duration,a=t.namespace;t=t.error;this.db=e,this.max=r,this.duration=n,this.namespace=a,this.error=t}return t.prototype.set=function(t,e){t="".concat(this.namespace,":").concat(t);var r=Date.now(),n={time:r,data:[]},a=this.db.get(t);(a="reset"!==e&&a?a:n).data.push(r),this.db.set(t,a)},t.prototype.get=function(t){var e="".concat(this.namespace,":").concat(t),r=Date.now(),n=(e=this.db.get(e)||{time:r,data:[]}).time;e=e.data;if(r-n<=this.duration&&e.length<this.max)return this.set(t);if(r-n>this.duration)return this.set(t,"reset");throw new Error("".concat(this.duration,"内超过最大限制").concat(this.max))},t}();module.exports=function(a){var i=a.id,o=a.db,s=a.max,c=a.duration,u=a.namespace,d=a.black,h=a.white,l=void 0===(l=a.driver)?"redis":l;i={id:i,db:o,max:void 0===s?100:s,duration:void 0===c?6e4:c,namespace:void 0===u?"limit":u,error:void 0===(a=a.error)?{code:429,msg:"too many requests"}:a,black:d,white:h};return"redis"===l?function(n){var a,i=n.id,o=n.db,s=n.max,c=n.duration,u=n.namespace,d=n.error,h=n.white,l=n.black;if(!i)throw new Error("id function is required");if(o)return a=new r({db:o,max:s,duration:c,namespace:u,error:d}),function(r,n){return t(void 0,void 0,void 0,(function(){var t,o,s,c,u,f,p;return e(this,(function(e){switch(e.label){case 0:return t=i(r),c=Boolean,[4,h(r)];case 1:return o=c.apply(void 0,[e.sent()]),u=Boolean,[4,l(r)];case 2:s=u.apply(void 0,[e.sent()]),p=(f=d).code,e.label=3;case 3:if(e.trys.push([3,8,,9]),s)throw f={code:p=403,msg:"forbidden"},new Error("blacklist");return s||!o?[3,5]:[4,n()];case 4:return[2,e.sent()];case 5:return[4,a.get(t)];case 6:return e.sent(),[4,n()];case 7:return[2,e.sent()];case 8:return e.sent(),r.status=p,r.body=f,[3,9];case 9:return[2]}}))}))};throw new Error("db is required")}(i):"memory"===l?function(r){var a,i=r.id,o=r.max,s=r.duration,c=r.namespace,u=r.error,d=r.white,h=r.black;if(i)return a=new n({db:new Map,max:o,duration:s,namespace:c,error:u}),function(r,n){return t(void 0,void 0,void 0,(function(){var t,o,s,c,l,f,p;return e(this,(function(e){switch(e.label){case 0:return t=i(r),c=Boolean,[4,d(r)];case 1:return o=c.apply(void 0,[e.sent()]),l=Boolean,[4,h(r)];case 2:s=l.apply(void 0,[e.sent()]),p=(f=u).code,e.label=3;case 3:if(e.trys.push([3,8,,9]),s)throw f={code:p=403,msg:"forbidden"},new Error("blacklist");return s||!o?[3,5]:[4,n()];case 4:return[2,e.sent()];case 5:return[4,a.get(t)];case 6:return e.sent(),[4,n()];case 7:return[2,e.sent()];case 8:return e.sent(),r.status=p,r.body=f,[3,9];case 9:return[2]}}))}))};throw new Error("id function is required")}(i):void 0};
