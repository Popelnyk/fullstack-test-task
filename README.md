## 1. Data streaming. If the scroller is at its maximum timestamp, get fresh data from the service and update the table.

0. if the scrollbar at its maximum -- make new request to the server

1. if new data is added to the table and we have cached previous data we can merge previous data + new data, without recalculating whole table,
because we have result at last timestamp (e.g take results for the last timestamp + add new values === new record for table)

2. if we are not sure if fresh data is partly the same with previous (e.g first timestamp of fresh data is far away from last timestamp of old data) -- we can just recalculate data

## 2. Performance. How to optimize rerendering when the scroller moves if the original JSON has 100K entries (1000 users, 10 resources, 10 events - eventually display a table of ~10K lines).

We can use react-virtualized (https://github.com/bvaughn/react-virtualized), or react-window (https://github.com/bvaughn/react-window)
or
Precalc all values + use React.Memo (maybe)

## 3. Improvement. How you can change the component and the API of the service when the number of users scales up.

1. use pagination. 
2. move all heavy-logic to the server-side