import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { alertService, AlertType } from '../_services';

const propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

const defaultProps = {
    id: 'default-alert',
    fade: true
};

function Alert({ id, fade }) {
    const history = useHistory();
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // inscreva-se para receber novas notificações de alerta
        const subscription = alertService.onAlert(id)
            .subscribe(alert => {
                // alertas claros quando um alerta vazio é recebido
                if (!alert.message) {
                    setAlerts(alerts => {
                        // filtrar alertas sem o sinalizador 'keepAfterRouteChange'
                        const filteredAlerts = alerts.filter(x => x.keepAfterRouteChange);

                        // remover a sinalização 'keepAfterRouteChange' no resto
                        filteredAlerts.forEach(x => delete x.keepAfterRouteChange);
                        return filteredAlerts;
                    });
                } else {
                    // adicionar alerta ao array
                    setAlerts(alerts => ([...alerts, alert]));

                    // alerta de fechamento automático se necessário
                    if (alert.autoClose) {
                        setTimeout(() => removeAlert(alert), 3000);
                    }
                }
            });

        // alertas claros sobre mudança de local
        const historyUnlisten = history.listen(({ pathname }) => {
            // não está claro se o nome do caminho tem uma barra porque ele será redirecionado automaticamente novamente
            if (pathname.endsWith('/')) return;

            alertService.clear(id);
        });

        // função de limpeza que é executada quando o componente é desmontado
        return () => {
            // cancele a inscrição e cancele a escuta para evitar vazamentos de memória
            subscription.unsubscribe();
            historyUnlisten();
        };
    }, []);

    function removeAlert(alert) {
        if (fade) {
            // alerta de desaparecimento
            const alertWithFade = { ...alert, fade: true };
            setAlerts(alerts => alerts.map(x => x === alert ? alertWithFade : x));

            // remover alerta depois de apagado
            setTimeout(() => {
                setAlerts(alerts => alerts.filter(x => x !== alertWithFade));
            }, 250);
        } else {
            // remover alerta
            setAlerts(alerts => alerts.filter(x => x !== alert));
        }
    }

    function cssClasses(alert) {
        if (!alert) return;

        const classes = ['alert', 'alert-dismissable'];
                
        const alertTypeClass = {
            [AlertType.Success]: 'alert alert-success',
            [AlertType.Error]: 'alert alert-danger',
            [AlertType.Info]: 'alert alert-info',
            [AlertType.Warning]: 'alert alert-warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    if (!alerts.length) return null;

    return (
        <div className="container">
            <div className="m-3">
                {alerts.map((alert, index) =>
                    <div key={index} className={cssClasses(alert)}>
                        <a className="close" onClick={() => removeAlert(alert)}>&times;</a>
                        <span dangerouslySetInnerHTML={{__html: alert.message}}></span>
                    </div>
                )}
            </div>
        </div>
    );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;
export { Alert };