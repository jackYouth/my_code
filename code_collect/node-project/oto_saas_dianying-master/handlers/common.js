/**
 * Created by Garry on 2017/5/9.
 */

const moment = require('moment');

const weekdays = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    0: '日'
};

module.exports = {
    dateMapping: date => {
        var today = moment().format('YYYY-MM-DD');
        var tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
        var dayAfterTomorrow = moment().add(2, 'days').format('YYYY-MM-DD');

        var map = {
            [today]: '今天',
            [tomorrow]: '明天',
            [dayAfterTomorrow]: '后天',
            1: '周一',
            2: '周二',
            3: '周三',
            4: '周四',
            5: '周五',
            6: '周六',
            0: '周日',
        };

        if (map[date]) {
            return `${map[date]} ${moment(date).format('M月DD日')}`;
        }

        return `${map[moment(date).day()]} ${moment(date).format('M月DD日')}`;

    },

    /**
     * 两点之间距离
     * @private
     * @param point1
     * @param point2
     * @returns {{val: number}}
     */
    getDistance: (point1, point2) => {
        if ((Math.abs(point1.lat) > 90) || (Math.abs(point2.lat) > 90)) {
            return;
        }
        if ((Math.abs(point1.lng) > 180) || (Math.abs(point2.lng) > 180)) {
            return;
        }
        var rad = function (d) {
            return d * Math.PI / 180.0;
        };

        var radLat1 = rad(point1.lat),
            radLat2 = rad(point2.lat),
            a = radLat1 - radLat2,
            b = rad(point1.lng) - rad(point2.lng);

        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));

        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        var data = {
            val: s,
        };

        if (s < 1) {
            data.display = (s * 1000).toFixed(0) + 'm';
        } else if (s) {
            data.display = s.toFixed(2) + 'km';
        }

        return data;
    },

    comingMovieMapping: movies => {
        const filmGroupByDateHash = {};
        const filmGroupByMonthHash = {};
        const filmsGroupByDate = [];
        const filmsGroupByMonth = [];
        const videos = [];

        movies.forEach(m => {
            let {publishTime} = m;

            if (moment(publishTime).month() <= moment().add(3, 'month')) {
                if (m.videos && m.videos.length) {
                    const video = m.videos[0];

                    videos.push({
                        name: video.name,
                        img: video.img,
                        url: video.url
                    });
                }

                let date = /^\d{4}-\d{2}$/.test(publishTime)
                    ? `${publishTime} 待定`
                    : `${publishTime} 周${weekdays[moment(publishTime).weekday()]}`;
                let monthVal = moment(publishTime).month();
                let month = `${monthVal + 1}月`;

                filmGroupByDateHash[publishTime] = filmGroupByDateHash[publishTime] || {
                        date,
                        films: []
                    };

                filmGroupByMonthHash[monthVal] = filmGroupByMonthHash[monthVal] || {
                        month,
                        films: []
                    };

                filmGroupByDateHash[publishTime].films.push(m);
                filmGroupByMonthHash[monthVal].films.push(m);
            }
        });

        Object.keys(filmGroupByDateHash).sort((x, y) => {
            const reg = /^\d{4}-\d{2}$/;
            const xMonth = moment(x).month();
            const yMonth = moment(y).month();

            if (reg.test(x)) {
                return xMonth == yMonth ? 1 : -1;
            }

            if (reg.test(y)) {
                return xMonth == yMonth ? -1 : 1;
            }

            return x > y ? 1 : -1
        }).forEach(k => {
            const item = filmGroupByDateHash[k];

            filmsGroupByDate.push({
                date: item.date,
                films: item.films.sort((x, y) => moment(x.publishTime) > moment(y.publishTime) ? 1 : -1)
            });
        });

        Object.keys(filmGroupByMonthHash).sort((x, y) => x > y ? 1 : -1).forEach(k => {
            const item = filmGroupByMonthHash[k];

            filmsGroupByMonth.push({
                month: item.month,
                films: item.films.sort((x, y) => moment(x.publishTime) > moment(y.publishTime) ? 1 : -1)
            });
        });

        return {
            videos,
            filmsGroupByDate,
            filmsGroupByMonth
        }
    }
};