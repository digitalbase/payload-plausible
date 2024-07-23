# What is this

This is a collection of code that makes PayloadCMS get plausible data + display it in a statistics components.

[Demo Here](https://x.com/digitalbase/status/1815491417113833974)

Please note the code is rough. I have no idea what i'm doing :-)

### Requirements

* Payload 3.x beta
* Recharts 2.13.0-alpha.4 (because of react 19 fix)

### Folders

* Statistics: This is the component i use to display charts in the Payload Admin
* CLI: This has the script (pullMonthlyPlausibleData) with some helpers. Don't forget to update token in 'getPlausibleDataForPath'
* Various: example collection that has the plausible fields


### How I run this

I cronned a task every 30 minutes to call the script. The script only fetches X items
and starts with the last updated one.

We have about 1000 pages, this means that every 50 hours or so all data is refreshed.

