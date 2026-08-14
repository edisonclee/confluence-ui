export function filterTimeframes(

    timeframes,

    filters

) {

    return timeframes

        .filter(timeframe =>

            filters.timeframes.includes(

                timeframe.timeframe

            )

        )

        .map(timeframe => ({

            ...timeframe,

            results:

                timeframe.results.filter(result => {

                    const coinMatch =

                        result.symbol

                            .toUpperCase()

                            .includes(

                                filters.coin.toUpperCase()

                            );

                    const bbMatch =

                        filters.minBbWidth === ""

                        ||

                        result.bbWidthPercent >= Number(filters.minBbWidth);

                    return coinMatch && bbMatch;

                })

        }))

        .filter(timeframe =>

            timeframe.results.length > 0

        );

}

export function filterMultiTimeframe(

    results,

    filters

) {

    return results.filter(result =>

        result.symbol

            .toUpperCase()

            .includes(

                filters.coin.toUpperCase()

            )

    );

}