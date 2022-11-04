The web service provides the data in following JSON format:

```
{timestamp: int; name: string; resource: string; value: int}
{timestamp: int; name: string; resource: string; value: int}
...
```

Each entry contains the change of a `resource` by `value` for a user `name` at a `timestamp`.

URL to access data is `https://raw.githubusercontent.com/alexgavrushenko/lootbox/master/generated.log`.

In the beginning, all users have 0 resources.

The goal is to see a report showing the amount of each resource the users have at a *certain* moment of time.

Implement a component that loads the data once and consists of:

- A scroller (range selector, e.g. react-range) of all entries from the earliest to the latest timestamp
- A table of resources

The scroller determines the time for which data is displayed in the table of resources.

The table of resources displays the total amount of each resource and the amount of each resource each user has. The data is sorted first by the resource value in descending order (the value is the inverse of the total
amount of the resource for all users at the moment), then by the resource amount each user has in descending order, for example:

|           |Gold   |20    |
|Alice      |Gold   |10    |
|Bob        |Gold   |9     |
|Charlie    |Gold   |1     |
|           |Silver |100501|
|Charlie    |Silver |100000|
|Bob        |Silver |500   |
|Alice      |Silver |1     |

When scrolling the time selector, the table should be updated in real time (while moving the scroller).

Describe the required updates for these followup ideas:

1. Data streaming. If the scroller is at its maximum timestamp, get fresh data from the service and update the table.
2. Performance. How to optimize rerendering when the scroller moves if the original JSON has 100K entries (1000 users, 10 resources, 10 events - eventually display a table of ~10K lines).
3. Improvement. How you can change the component and the API of the service when the number of users scales up.

--------------------------------------------------------------------------

## 1. Data streaming. If the scroller is at its maximum timestamp, get fresh data from the service and update the table.

0. if the scrollbar at its maximum -- make new request to the server

1. if new data is added to the table and we have cached previous data we can merge previous data + new data, without recalculating whole table,
because we have result at last timestamp (e.g take results for the last timestamp + add new values === new record for table)

2. if we are not sure if fresh data is partly the same with previous (e.g first timestamp of fresh data is far away from last timestamp of old data) -- we can just recalculate data

## 2. Performance. How to optimize rerendering when the scroller moves if the original JSON has 100K entries (1000 users, 10 resources, 10 events - eventually display a table of ~10K lines).

Precalc all values + use React.Memo (maybe)
Make each line in a table as a component and cache it

## 3. Improvement. How you can change the component and the API of the service when the number of users scales up.

1. use pagination. 
2. move all heavy-logic to the server-side
3. We can use react-virtualized (https://github.com/bvaughn/react-virtualized), or react-window (https://github.com/bvaughn/react-window)
