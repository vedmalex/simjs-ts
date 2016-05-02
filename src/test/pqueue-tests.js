import test from 'ava';
import * as Sim from '../sim';

test('testPQueue', (t) => {
  function printpq(arr) {
    for (let i = 0; i < arr.length; i++) {
      print(arr[i].deliverAt + ', ');
    }
    print('\n');
  }

  function assertArrays(a, b) {
    t.is(a.length, b.length);

    for (let i = 0; i < a.length; i++) {
      t.is(a[i], b[i]);
    }
  }

  let dataset = [[],
                 [0],
                 [1],
                 [1, 2],
                 [2, 1],
                 [1, 2, 3],
                 [3, 2, 1],
                 [3, 1, 2],
                 [1, 2, 3, 4],
                 [4, 3, 1, 2],
                 [1, 1, 1, 1],
                 [1, 1, 3, 1, 1],
                 [9, 8, 7, 6, 5, 4, 3, 2, 1],
                 [9, 8, 7, 6, 5, 4, 3, 2, 1, 10]];

  for (let i = 0; i < dataset.length; i++) {
    let arr = dataset[i];
    // insert
    let pq = new Sim.PQueue();
    for (let j = 0; j < arr.length; j++) {
      pq.insert(new Sim.Request(0, 0, arr[j]));
    }

    let out = [];
    while (true) {
      let a = pq.remove();
      if (a === undefined) break;
      out.push(a.deliverAt);
    }

    assertArrays(arr.sort((a, b) => { return a - b; }), out);

  }
});
