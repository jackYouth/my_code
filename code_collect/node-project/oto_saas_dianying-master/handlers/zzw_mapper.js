/**
 * Created by garry on 16/9/1.
 */
'use strict';

const moment = require('moment');
const configLoader = require('@boluome/consul')('dianying');

/**
 * 两点之间距离
 * @private
 * @param point1
 * @param point2
 * @returns {{val: number}}
 */
var getDistance = (point1, point2) => {
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
};

module.exports = {
    regionsMapping: regions => {
        return regions.map(r => {
            return {
                id: r.regionId,
                name: r.regionName,
            };
        });
    },

    /**
     * 电影院数据映射
     * @point 当前经纬度
     * @param src
     * @param dest
     */
    cinemaMapping: (point, cinemas) => {
        return cinemas.map(c => {
            var cinema = {
                id: c.cinemaId,
                name: c.cinemaName,
                address: c.cinemaAdd,
                districtId: c.regionId,
            };

            var dis = getDistance(point, {
                lat: c.latitude,
                lng: c.longitude,
            });

            if (dis && dis.val) {
                cinema.dis = dis.val;
                cinema.distance = dis.display;
            } else {
                cinema.dis = 1000;
                cinema.distance = '1000km';
            }

            return cinema;
        });
    },

    /**
     * 电影数据映射
     * @param src
     * @param dest
     */
    movieArrayMapping: films => {
        var now = moment().format('YYYY-MM-DD');

        return films.filter(f => now >= f.openingDate).map(f => {
            return {
                id: f.filmId,
                name: f.filmName,
                type: f.catalog,
                length: f.duration,
                pic: f.picture,
                score: 8,
                actor: f.actor,
                director: f.director,
                dimension: f.dimensional,
                hasImax: 0,
                publishTime: f.openingDate,
                isOnShow: moment() >= moment(f.openingDate) ? 1 : 0,
            };
        });
    },

    movieMapping: movie => {
        return movie.map(m => {
            return {
                id: m.filmId,
                name: m.filmName,
                pic: m.picture,
                score: 8,
                actor: m.actor,
                director: m.director,
                dimension: m.dimensional,
                hasImax: 0,
                description: m.description.replace(/<(span|br|p).*?>/g, '').replace(/<\/(span|p)>/g, '').replace(/&(.+?);/g, '').replace(/\s{4}/g, ''),
                type: m.catalog,
                length: m.duration,
                publishTime: m.openingDate,
                isOnShow: moment() >= moment(m.openingDate) ? 1 : 0
            };
        });
    },

    orderMapping: (p, mvOrder) => {
        var seatName = [];

        mvOrder.seats.forEach(s => {
            seatName.push(s.rowId + '排' + s.columnId + '座');
        });

        var show = mvOrder.show;
        var time = show.showTime.toString();

        time = time.substring(0, time.length - 2) + ':' + time.substring(time.length - 2, time.length);

        return {
            userId: p.userId,
            orderPrice: Number(((Number(show.userPrice) + configLoader.getConfig().ZZW_PRICE_RAISING) * p.count).toFixed(2)),
            realPrice: show.merPrice * p.count,
            phone: p.phone,
            partnerId: mvOrder.orderId,
            name: show.filmName,
            movieName: show.filmName,
            hallName: show.hallName,
            showDate: show.showDate,
            showTime: time,
            language: show.language,
            screenType: show.dimensional,
            seatName: seatName.join(' '),
            couponId: p.couponId,
            activityId: p.activityId,
            channel: 'zzw',
            count: p.count,
            cinema: {
                id: show.cinemaId,
                name: show.cinemaName,
            },
            moviePhoto: p.moviePhoto,
            customerId: p.customerId,
            customerUserId: p.customerUserId,
            userPhone: p.userPhone,
            appCode: p.appCode,
        };
    },

    moviePlanMapping: (plans, endbuyDate) => {
        return plans.map(item => {
            var time = item.showTime.toString();
            var showDate = new moment(item.showDate + ' ' + time.substring(0, time.length - 2) + ':' + time.substring(time.length - 2, time.length) + ':00');

            return {
                planId: item.showId,
                hallId: item.hallId,
                startTime: showDate.format('HH:mm'),
                isExpire: showDate > moment() ? false : (parseInt(showDate.format('x')) - parseInt(new moment().format('x')) - (parseInt(endbuyDate) * 60 * 1000) <= 0),
                endTime: new moment(showDate.valueOf() + parseInt(item.duration) * 60 * 1000).format('HH:mm'),
                screenType: item.dimensional,
                hallName: item.hallName,
                price: Number(item.userPrice) + configLoader.getConfig().ZZW_PRICE_RAISING,
                language: item.language,
            };
        });
    },

    /**
     * 某个排期的座位分布图映射
     * @public
     * @param all 所有座位
     * @param saled 已售出的座位
     */
    seatsMapping: (all, saled) => {
        var totalRow = all.maxrowNum;
        var totalCol = all.maxcolumn;

        var result = [];

        for (var r = 1; r <= totalRow; r++) {
            var rowData = all.row.filter(item => item.rowNum == r)[0];

            var row = [];

            if (rowData) {
                var columnIds = rowData.columnIds.split('|');
                var loveIndexs = rowData.loveIndex.split('|');

                for (var c = 1; c <= totalCol; c++) {
                    var index = columnIds.indexOf(String(c));

                    if (index != -1) {
                        var saledSeat = saled.seats.filter(s => s.rowId == rowData.rowId && s.columnIds.split('|').indexOf(String(c)) > -1)[0];

                        row.push({
                            id: `${rowData.rowId}:${c}`,
                            seatRow: rowData.rowId,
                            seatCol: c,
                            status: saledSeat ? 1 : 0,
                            type: loveIndexs[index] == '0' ? 0 : 1,
                        });
                    } else {
                        row.push({
                            id: -1,
                            seatRow: -1,
                            seatCol: -1,
                            type: '',
                            status: -1,
                        });
                    }
                }

                result.push(row);
            } else {
                //空行 (走廊)
                for (let c = 1; c <= totalCol; c++) {
                    row.push({
                        id: -1,
                        seatRow: -1,
                        seatCol: -1,
                        type: '',
                        status: -1,
                    });
                }

                result.push(row);
            }
        }

        return result;
    },

    seatsMapping_v2: (all, saled) => {
        var result = {
            rowMax: all.maxrowNum,
            colMax: all.maxcolumn
        };

        var rows = all.row, seats = [];

        for (var i = 0; i < rows.length; i++) {
            if (!rows[i].columnIds) continue;
            var list = [], columnIds = rows[i].columnIds.split('|'), loves = rows[i].loveIndex.split('|');
            for (var j = 0; j < columnIds.length, j < loves.length; j++) {
                if (columnIds[j] == 'ZL')
                    continue;

                list.push({
                    col: j + 1,
                    row: rows[i].rowNum,
                    seatCol: columnIds[j],
                    seatRow: rows[i].rowId,
                    status: 0,
                    type: loves[j] == '0' ? 0 : 1//默认是从左向右连续两个为单位
                });
            }
            seats.push(list);
        }
        //去除那些已经售卖的座位
        for (var k = 0; k < seats.length; k++) {
            for (var n = 0; n < seats[k].length; n++) {
                for (var m = 0; m < saled.seats.length; m++) {
                    if (seats[k][n].seatRow == saled.seats[m].rowId) {
                        var colums = saled.seats[m].columnIds.split('|');
                        if (colums && colums.length > 0 && colums.indexOf(seats[k][n].seatCol) > -1)
                            seats[k][n].status = 1;
                    }
                }
            }
        }

        result.seats = seats;

        return result;
    },

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
};