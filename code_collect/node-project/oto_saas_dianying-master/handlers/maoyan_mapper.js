/**
 * Created by Garry on 2017/7/19.
 */

const moment = require('moment');
const common = require('./common');

const getHttpsImageUrl = url => url.replace(/http:/, 'https:').replace('w.h/', '');

const getIsOnShow = showst => {
    let isOnShow = 1;

    switch (showst) {
        case 1:
            isOnShow = 0;
            break;
        case 3:
            isOnShow = 1;
            break;
        case 4:
            isOnShow = 2;
        default:
            break;
    }

    return isOnShow;
};

module.exports = {
    getHttpsImageUrl,

    cinemaMapping: (cinema, point) => {
        let result = {
            id: cinema.cinemaId,
            name: cinema.cinemaName,
            address: cinema.cinemaAddr,
            districtId: cinema.locationId
        }

        const dis = common.getDistance(point, {lat: cinema.latitude, lng: cinema.longitude});

        if (dis && dis.val) {
            result.dis = dis.val;
            result.distance = dis.display;
        }

        return result;
    },

    commingMovieMapping: movie => {
        let publishTime = movie.rt;
        if (/^\d{4}-\d{1,2}$/.test(publishTime)) {
            publishTime = moment(publishTime).format('YYYY-MM');
        }

        return {
            id: movie.id,
            name: movie.name,
            type: '',
            length: movie.dur,
            pic: getHttpsImageUrl(movie.img),
            score: movie.sc,
            actor: movie.star,
            director: movie.dir,
            hasImax: /巨幕/.test(movie.ver) * 1,
            dimension: /3D/.test(movie.ver) ? '3D' : '2D',
            publishTime,
            isOnShow: getIsOnShow(movie.showst),
            videos: movie.videos
        }
    },

    movieArrayMapping: movies => {
        return movies.map(m => {
            let publishDate = '';
            const reg = /\d{4}-\d{2}-\d{2}/;

            if (reg.test(m.pubDesc)) {
                publishDate = reg.exec(m.pubDesc)[0];
            }

            return {
                id: m.id,
                name: m.name,
                type: m.category,
                length: m.duration,
                pic: getHttpsImageUrl(m.avatar || ''),
                score: Math.round(m.score * 10) / 10,
                actor: m.stars,
                director: m.directors,
                hasImax: /巨幕/.test(m.ver) * 1,
                dimension: /3D/.test(m.ver) ? '3D' : '2D',
                publishTime: publishDate,
                isOnShow: getIsOnShow(m.showst),
            }
        });
    },

    movieMapping: movie => {
        return {
            id: movie.id,
            name: movie.name,
            pic: getHttpsImageUrl(movie.avatar || ''),
            score: (Math.round(movie.score * 10) / 10).toString(),
            actor: movie.stars,
            description: movie.drama,
            director: movie.directors,
            type: movie.category,
            length: movie.duration,
            publishTime: movie.pubDesc,
            hasImax: /巨幕/.test(movie.ver) * 1,
            dimension: /3D/.test(movie.ver) ? '3D' : '2D',
            performers: movie.celebrities.map(c => c.list).reduce((x, y) => x.concat(y)).map(c => {
                return {
                    role: c.description,
                    name: c.name,
                    avatar: getHttpsImageUrl(c.avatar)
                }
            }).filter(p => p.role && p.name && p.avatar),
            videos: movie.videos.map(v => {
                return {
                    name: v.name,
                    image: v.img,
                    url: v.url
                }
            }),
            images: movie.photos.map(p => getHttpsImageUrl(p.olonk)),
            isOnShow: getIsOnShow(movie.showst),
        }
    },

    moviePlanMapping: (plans, opt) => {
        let hash = {};
        let result = [];

        plans.forEach(p => {
            let date = moment(p.showStartTime).format('YYYY-MM-DD');

            hash[date] = hash[date] || [];
            hash[date].push({
                planId: p.showId,
                hallId: p.hallCode,
                startTime: moment(p.showStartTime).format('HH:mm'),
                isExpire: Date.now() > p.showStartTime,
                endTime: moment(p.showStartTime + (opt.movieLength || 120) * 60 * 1000).format('HH:mm'),
                screenType: p.showVersionType || '',
                hallName: p.hallName,
                price: Number(p.settlePriceForMerchant / 100),
                language: p.language,
                isFull: p.isFull
            });
        });

        Object.keys(hash).sort((a, b) => a > b).forEach(k => {
            let plans = hash[k].filter(p => !p.isExpire);
            if (plans.length < 4) {
                plans = hash[k].splice(-4);
            }

            result.push({
                dateStr: common.dateMapping(k),
                date: k,
                plan: plans
            });
        });

        return result;
    },

    seatsMapping: seats => {
        const totalRow = eval(`Math.max(${seats.map(s => s.rowNo).join(',')})`);
        const totalCol = eval(`Math.max(${seats.map(s => s.columnNo).join(',')})`);

        let result = [];

        for (let r = 1; r <= totalRow; r++) {
            let row = [];

            for (let c = 1; c <= totalCol; c++) {
                let seat = seats.filter(s => s.rowNo == r && s.columnNo == c)[0];

                if (seat) {
                    row.push({
                        id: seat.seatNo,
                        col: c,
                        row: r,
                        seatRow: seat.rowId,
                        seatCol: seat.columnId,
                        type: (seat.status == 'L' || seat.status == 'R') ? 1 : 0,
                        status: seat.status == 'E'
                            ? -1
                            : seat.status == 'LK' ? 1 : 0,
                    });
                } else {
                    row.push({
                        id: -1,
                        col: c,
                        row: r,
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
    }
};