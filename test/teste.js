let mains = ['aa','bb','cc','aabb','xddx'];

let others = [{fr:3,tx:'cc'}, {fr:6,tx:'dd'}, {fr:4,tx:'aa'}, {fr:1,tx:'cbb'}];

others.sort((a,b) => b.fr - a.fr);

console.log(others);