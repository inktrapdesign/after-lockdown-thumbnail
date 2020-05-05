module.exports = {
    templateConfig () {
        return {
            width: 840,
            height: 420
        }
    },

    templateHtml(params) {
        // Pull in config
        const config = this.templateConfig();

        // Return HTML Template
        return `
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css?family=Poppins:600&display=swap" rel="stylesheet">
                <style>
                    body {
                        padding: 0;
                        margin: 0;
                        line-height: 1.2;
                        background-color: #AFCAE0;
                    }

                    .twitter {
                        width: ${config.width}px;
                        height: ${config.height}px;
                        padding: 60px;

                        box-sizing: border-box;

                        color: #2F2F33;

                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .card {
                        width: 290px;
                        height: 290px;
                        position: relative;
                        border-radius: 5px;
                        border: 2px solid #07080F;
                        background-color: #ffffff;
                        padding: 30px;
                        box-sizing: border-box;
                        margin-right: 10px;
                        margin-bottom: 10px;
                    }

                    .card:after {
                        content: "";
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 12px;
                        top: 12px;
                        background-color: #DBDBDB;
                        border: 2px solid #07080F;
                        box-sizing: border-box;
                        border-radius: 5px;
                        z-index: -1;
                    }

                    .card--blue:after {
                        background-color: #93BBDB;
                    }

                    .card--yellow:after {
                        background-color: #DBC793;
                    }

                    .card--pink:after {
                        background-color: #DB93C2;
                    }

                    .card--green:after{
                        background-color: #AADB93;
                    }

                    .card--red:after {
                        background-color: #DB9393;
                    }

                    .card--purple:after {
                        background-color: #AA93DB;
                    }

                    .card--grey:after {
                        background-color: #DBDBDB;
                    }

                    .card__message {
                        font-family: "Poppins", sans-serif;
                        font-style: normal;
                        font-weight: 600;
                        font-size: 20px;
                        line-height: 1.5;
                        color: #2F2F33;
                    }

                    .card__location {
                        position: absolute;
                        bottom: 30px;
                        left: 30px;
                        font-family: "Poppins", sans-serif;
                        font-style: normal;
                        font-weight: 600;
                        font-size: 11px;
                        line-height: 1.66;
                        letter-spacing: 0.05em;
                        text-transform: uppercase;
                        color: #9B9BA5;
                    }

                </style>
            </head>
            <body>
            <div class="twitter">
                <div class="card card--${params.color}">
                    <div class="card__message">After lockdown I want to ${params.message}</div>
                    <div class="card__location">- ${params.location}</div>
                </div>
            </div>
            </body>
        </html>
        `
    }
}