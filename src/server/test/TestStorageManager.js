const obj = {name: 'NONE'};
const test = {id: 12, obj};
console.log(JSON.stringify(test, null, 4));

import { List, Map, fromJS } from 'immutable';

//const state = fromJS([
//    {pageName: 't1', values: ['a', 'b']},
//    {pageName: 't2', values: ['a', 'cvbbcv']}
//]);

//console.log(state.find( value => value.get('pageName') === 't1' ));

let m = fromJS({props: { id: null, children:[{name: 'A'}, {name: 'B'}] }});

function changeId(m){
    m.setIn(['props', 'id'], 123);
    m.set('name', 'Dummy Name');
    m.getIn(['props', 'children']).forEach( child => {
        child.set('name', 'Chandler');
    });
}

let m1 = m.withMutations(map => { changeId(map) });

//let m1 = changeId(m);

console.log(m);

console.log(m1);

