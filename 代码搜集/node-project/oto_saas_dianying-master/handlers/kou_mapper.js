/**
 * Created by garry on 16/8/31.
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

var dealMovieDate = showDate => {
    var now = new moment(),
        nowTs = parseInt(now.format('x')) + (30 * 60 * 1000), //默认30分钟为某排期购买关门时间
        nowDateTs = parseInt(new moment(now.format('YYYY-MM-DD')).format('x'));

    var momentDate = new moment(showDate),
        dayOfWeek = parseInt(momentDate.format('e')),
        planTs = parseInt(new moment(momentDate.format('YYYY-MM-DD')).format('x')),
        displayDay = '';
    var tempTs = (planTs - nowDateTs) / (1000 * 60 * 60 * 24);

    if (tempTs == 0) {
        displayDay = '今天';
    } else if (tempTs == 1) {
        displayDay = '明天';
    } else if (tempTs == 2) {
        displayDay = '后天';
    } else {
        displayDay = '周';
        switch (dayOfWeek) {
            case 1:
                displayDay += '一';
                break;
            case 2:
                displayDay += '二';
                break;
            case 3:
                displayDay += '三';
                break;
            case 4:
                displayDay += '四';
                break;
            case 5:
                displayDay += '五';
                break;
            case 6:
                displayDay += '六';
                break;
            case 0:
                displayDay += '日';
                break;
            default:
                break;
        }
    }

    return {
        display: displayDay + ' ' + momentDate.format('M月DD日'),
        date: new moment(showDate).format('YYYY-MM-DD'),
        isExpire: momentDate.format('x') - nowTs > 0 ? false : true,
        time: momentDate.format('HH:mm'),
        dateValue: momentDate.valueOf(),
    };
};

module.exports = {
    cinemaMapping: (cinema, point) => {
        var result = {
            id: cinema.cinemaId,
            name: cinema.cinemaName,
            address: cinema.cinemaAddress.replace(/&nbsp;/g, ''),
            districtId: cinema.districtId,
            hasPlans: cinema.hasPlans
        };

        var dis = getDistance(point, {lat: cinema.latitude, lng: cinema.longitude});

        if (dis && dis.val) {
            result.dis = dis.val;
            result.distance = dis.display;
        }

        return result;
    },

    /**
     * 电影数组映射
     * @param src
     * @param dest
     */
    movieArrayMapping: function (movies) {
        return movies.map(m => {
            var movie = {
                id: m.movieId,
                name: m.movieName,
                type: m.movieType,
                length: m.movieLength,
                pic: (m.pathVerticalS || '').replace(/http:/, 'https:'),
                score: Math.round(m.score * 10) / 10,
                actor: m.actor,
                director: m.director,
                hasImax: m.hasImax ? 1 : 0,
                dimension: m.has3D ? '3D' : '2D',
                publishTime: m.publishTime,
                isOnShow: new moment().format('YYYY-MM-DD') >= m.publishTime ? 1 : 2,
            };

            return movie;
        });
    },

    movieMapping: function (movie) {
        var obj = {
            id: movie.movieId,
            name: movie.movieName,
            pic: (movie.pathVerticalS || '').replace(/http:/, 'https:'),
            score: (Math.round(movie.score * 10) / 10).toString(),
            actor: movie.actor,
            description: (movie.intro || '').replace(/&(.+)?;/g, '').replace(/<[span|br|p].*?>/g, '').replace(/<\/[span|p]>/g, '').replace(/\s{4}/g, ''),
            director: movie.director,
            type: movie.movieType,
            length: movie.movieLength,
            publishTime: movie.publishTime,
            hasImax: movie.hasImax ? 1 : 0,
            dimension: movie.has3D ? '3D' : '2D',
            isOnShow: new moment().format('YYYY-MM-DD') >= movie.publishTime ? 1 : 2
        };

        return obj;
    },

    /**
     * 影院详情数据映射
     * @public
     * @param cinema
     */
    cinemaInfoMapping: cinema => {
        return {
            id: cinema.cinemaId,
            address: cinema.cinemaAddress,
            intro: cinema.cinemaIntro,
            name: cinema.cinemaName,
            tel: cinema.cinemaTel,
            city: cinema.cityName,
            district: cinema.districtName,
            drivePath: cinema.drivePath,
            flag: cinema.flag,
            imgs: cinema.galleries,
            hot: cinema.hot,
            logo: cinema.logo,
            lat: cinema.latitude,
            lng: cinema.longitude,
            openTime: cinema.openTime,
            mapType: 'gaode'
        };
    },

    /**
     * 影片排期数据映射
     * @public
     * @param src
     * @param dest
     */
    moviePlanMapping: (plans, opt) => {
        let hash = {};
        const premiumRate = configLoader.getConfig().KOU_PREMIUM_RATE[opt.appCode] || 1;

        plans.forEach(p => {
            let showDate = dealMovieDate(p.featureTime);
            const price = premiumRate == 1 ? p.price
                : Math.round(p.price * premiumRate);

            if (!hash[showDate.date]) {
                hash[showDate.date] = {
                    dateStr: showDate.display,
                    date: showDate.date,
                    plan: [],
                };
            }

            hash[showDate.date].plan.push({
                planId: p.planId,
                hallId: p.hallNo,
                startTime: showDate.time,
                isExpire: showDate.isExpire,
                endTime: new moment(showDate.dateValue + (opt.movieLength || 120) * 60 * 1000).format('HH:mm'),
                screenType: p.screenType || '',
                hallName: p.hallName,
                price,
                language: p.language,
                isFull: p.isFull
            });
        });

        let result = [];

        Object.keys(hash).sort((a, b) => a > b).forEach(k => {
            let plans = hash[k].plan.filter(p => !p.isExpire);
            if (plans.length < 4) {
                plans = hash[k].plan.splice(-4);
            }

            hash[k].plan = plans;

            result.push(hash[k]);
        });

        return result;
    },

    /**
     * 某个排期的座位分布图映射
     * @public
     * @param src
     * @param dest
     */
    seatsMapping: seats => {
        var totalRow = eval(`Math.max(${seats.map(s => s.graphRow).join(',')})`);
        var totalCol = eval(`Math.max(${seats.map(s => s.graphCol).join(',')})`);

        var result = [];

        for (var r = 1; r <= totalRow; r++) {
            var row = [];

            for (var c = 1; c <= totalCol; c++) {
                var seat = seats.filter(s => s.graphRow == r && s.graphCol == c)[0];

                if (seat) {
                    row.push({
                        id: seat.seatNo,
                        col: seat.graphCol,
                        row: seat.graphRow,
                        seatRow: seat.seatRow,
                        seatCol: seat.seatCol,
                        type: seat.seatType,
                        status: seat.seatState,
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
        }

        return result;
    },


    seatsMapping_v2: seats => {
        var result = {
            rowMax: 0,
            colMax: 0,
            seats: []
        };

        var seatList = [];
        seats.forEach(function (item) {
            var row;
            if (!(row = seatList[item.graphRow])) {
                row = seatList[item.graphRow] = [];
            }

            row.push({
                id: item.seatNo,
                col: item.graphCol,
                row: item.graphRow,
                seatCol: item.seatCol,
                seatRow: item.seatRow,
                status: item.seatState,     //0可用 1不可用
                type: item.seatType         //是否情侣座 0普通 1情侣
            });
            row.sort(function (a, b) {
                return a.col - b.col;
            });
        });

        for (var i in seatList) {
            var list = seatList[i];

            var lastCol = list[list.length - 1].col;
            if (lastCol > result.colMax) {
                result.colMax = lastCol;
            }
            if (list[0].row > result.rowMax) {
                result.rowMax = list[0].row;
            }
            result.seats.push(list);
        }

        return result;
    }
};