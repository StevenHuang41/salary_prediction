import pandas as pd
from skopt import BayesSearchCV
from skopt.space import Real, Integer, Categorical
from sklearn.metrics import mean_squared_error, mean_absolute_error

from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Ridge
from sklearn.linear_model import Lasso
from sklearn.linear_model import ElasticNet
from sklearn.linear_model import SGDRegressor
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import lightgbm as lgb

import keras
import keras_tuner as kt
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Dense, Input, Activation, LeakyReLU
from tensorflow.keras.activations import swish
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.metrics import mse, mae
from tensorflow.keras.models import load_model
import os

from tqdm import tqdm

import joblib
import shutil

import warnings
warnings.filterwarnings(
    "ignore", message="Skipping variable loading for optimizer"
)


def model_select(X_train, y_train,
                 X_test, y_test,
                 use_poly=False,
                 *, n_iter: int = 2) -> tuple[Model, str]:

    models_storage = {}

    def store_models(model, y_pred, name: str, model_params: dict):

        models_storage[name] = {
            'model': model,
            'mae': mean_absolute_error(y_test, y_pred),
            'mse': mean_squared_error(y_test, y_pred),
            'params': {}
        }

        models_storage[name]['params'].update(model_params)
        
        ## print result
        # print(f'name: {name}')
        # for i, v in models_storage[name]['params'].items():
        #     if type(v) == float:
        #         print(f'{i}: {v:.4f}')
        #     else :
        #         print(f'{i}: {v}')

        # print(f'mae: {models_storage[name]['mae']}', end='\n\n')


    def linear_model_training() -> None:
        linear_model = LinearRegression()
        linear_model.fit(X_train, y_train)

        y_pred_ols = linear_model.predict(X_test)

        store_models(linear_model,
                     y_pred_ols,
                     f"linear_model{'_poly' if use_poly else ''}",
                     {})


    def ridge_model_training():
        params_space = {
            'alpha': Real(low=1e-3, high=1e+2, prior='log-uniform'),
        }

        common_params = {
            'n_iter': n_iter,
            'cv': 5,
            'n_jobs': -1,
            'scoring': 'neg_mean_squared_error',
            'random_state': 23,
            'verbose': 0,
            'return_train_score': True,
        }

        ridge_model = BayesSearchCV(
            estimator=Ridge(),
            search_spaces=params_space,
            **common_params,
        )
        ridge_model.fit(X_train, y_train)
        y_pred_r = ridge_model.predict(X_test)
        store_models(ridge_model,
                     y_pred_r,
                     f"ridge_model{'_poly' if use_poly else ''}",
                     dict(ridge_model.best_params_))


    def lasso_model_training() -> None:
        params_space = {
            'alpha': Real(low=1e-3, high=1e+2, prior='log-uniform'),
            'selection': Categorical(['cyclic', 'random']),
        }

        common_params = {
            'n_iter': n_iter,
            'cv': 5,
            'n_jobs': -1,
            'scoring': 'neg_mean_squared_error',
            'verbose': 0,
            'random_state': 24,
        }

        lasso_model = BayesSearchCV(
            estimator=Lasso(max_iter=int(1e+6)),
            search_spaces=params_space,
            **common_params,
        )
        lasso_model.fit(X_train, y_train)
        y_pred_la = lasso_model.predict(X_test)
        store_models(lasso_model,
                     y_pred_la,
                     f"lasso_model{'_poly' if use_poly else ''}",
                     dict(lasso_model.best_params_))

    def elastic_model_training() -> None:
        params_space = {
            'alpha': Real(low=1e-3, high=1e+2, prior='log-uniform'),
            'l1_ratio': Real(low=0.01, high=0.99),
            'selection': Categorical(['cyclic', 'random']),
        }

        common_params = {
            'n_iter': n_iter,
            'cv': 5,
            'n_jobs': -1,
            'scoring': 'neg_mean_squared_error',
            'random_state': 43,
            'verbose': 0,
        }

        elastic_model = BayesSearchCV(
            estimator=ElasticNet(max_iter=int(1e+6)),
            search_spaces=params_space,
            **common_params,
        )

        elastic_model.fit(X_train, y_train)
        y_pred_e = elastic_model.predict(X_test)
        store_models(elastic_model,
                     y_pred_e,
                     f"elastic_model{'_poly' if use_poly else ''}",
                     dict(elastic_model.best_params_))


    def SGD_model_training() -> None:
        params_space = [
            {
                'penalty': Categorical(['elasticnet']),
                'alpha': Real(1e-5, 1e+2, prior='log-uniform'),
                'l1_ratio': Real(0.01, 0.99),
                'learning_rate': Categorical(['adaptive', 'constant', 'invscaling']),
                'eta0': Real(1e-5, 1, prior='log-uniform'),
            },
            {
                'penalty': Categorical(['l1']),
                'alpha': Real(1e-5, 1e+2, prior='log-uniform'),
                'learning_rate': Categorical(['adaptive', 'constant', 'invscaling']),
                'eta0': Real(1e-5, 1, prior='log-uniform'),
            },
            {
                'penalty': Categorical(['l2']),
                'alpha': Real(1e-5, 1e+2, prior='log-uniform'),
                'learning_rate': Categorical(['adaptive', 'constant', 'invscaling']),
                'eta0': Real(1e-5, 1, prior='log-uniform'),
            },
        ]

        common_params = {
            'n_iter': n_iter,
            'cv': 5,
            'n_jobs': -1,
            'scoring': 'neg_mean_squared_error',
            'random_state': 23,
            'verbose': 0,
        }

        SGD_model = BayesSearchCV(
            estimator=SGDRegressor(max_iter=int(1e+6), early_stopping=True),
            search_spaces=params_space,
            **common_params,
        )
        SGD_model.fit(X_train, y_train)
        y_pred_sgd = SGD_model.predict(X_test)
        store_models(SGD_model,
                     y_pred_sgd,
                     f"SGD_model{'_poly' if use_poly else ''}",
                     dict(SGD_model.best_params_))

    def randomForest_model_training() -> None:
        params_space = {
            'n_estimators': Integer(100, 500),
            'criterion': Categorical(['squared_error', 'absolute_error', 'friedman_mse', 'poisson']),
            'max_depth': Integer(5, 30),
            'min_samples_split': Integer(2, 10),
            'min_samples_leaf': Integer(1, 10),
        }

        common_params = {
            'n_iter': n_iter,
            'cv': 5,
            'scoring': 'neg_mean_squared_error',
            'n_jobs': -1,
            'random_state': 43,
            'verbose': 0,
        }

        rf_model = BayesSearchCV(
            estimator=RandomForestRegressor(),
            search_spaces=params_space,
            **common_params,
        )

        rf_model.fit(X_train, y_train)
        y_pred_rf = rf_model.predict(X_test)
        store_models(rf_model,
                     y_pred_rf,
                     f"randomForest{'_poly' if use_poly else ''}",
                     dict(rf_model.best_params_))

    def XGBRandomForest_model_training() -> None:
        params_space = {
            'n_estimators': Integer(100, 500),
            'max_depth': Integer(5, 30),
            'subsample': Real(0.9, 1),
            'colsample_bytree': Real(0.9, 1),
            'reg_lambda': Real(0, 10),
            'reg_alpha': Real(0, 10),
            'gamma': Integer(0, 5),
        }

        common_params = {
            'n_iter': n_iter,
            'cv': 5,
            'scoring': 'neg_mean_squared_error',
            'n_jobs': -1,
            'random_state': 43,
            'verbose': 0,
        }

        xgb_rf_model = BayesSearchCV(
            estimator=xgb.XGBRFRegressor(),
            search_spaces=params_space,
            **common_params,
        )

        xgb_rf_model.fit(X_train, y_train)
        y_pred_xgb_rf = xgb_rf_model.predict(X_test)
        store_models(xgb_rf_model,
                     y_pred_xgb_rf,
                     f"xgb_randomForest{'_poly' if use_poly else ''}",
                     dict(xgb_rf_model.best_params_))


    def LGBM_model_training() -> None:
        params_space = {
            'boosting_type': Categorical(['gbdt', 'dart', 'rf']),
            'num_leaves': Integer(20,100),
            'max_depth': Integer(5, 30),
            'learning_rate': Real(1e-2, 1e+2),
            'n_estimators': Integer(100, 500),
            'subsample': Real(0.9, 1),
            'subsample_freq': Integer(0, 7),
            'colsample_bytree': Real(0.9, 1),
            'reg_alpha': Real(0, 10),
            'reg_lambda': Real(0, 10),
            'bagging_freq': Integer(1, 7),
            'bagging_fraction': Real(0.5, 0.99),
            'feature_fraction': Real(0.5, 0.99),
        }

        common_params = {
            'n_iter': n_iter,
            'cv': 5,
            'scoring': 'neg_mean_squared_error',
            'n_jobs': -1,
            'random_state': 43,
            'verbose': 0,
        }

        lgb_rf_model = BayesSearchCV(
            estimator=lgb.LGBMRegressor(verbose=-1),
            search_spaces=params_space,
            **common_params,
        )

        lgb_rf_model.fit(X_train, y_train)
        y_pred_lgb_rf = lgb_rf_model.predict(X_test)
        store_models(lgb_rf_model,
                     y_pred_lgb_rf,
                     f"lgb_randomForest{'_poly' if use_poly else ''}",
                     dict(lgb_rf_model.best_params_))


    def NN_model_training() -> None:

        ## remove history of tuner
        # if os.path.isfile('untitled_project/tuner0.json'):
        #     os.remove('untitled_project/tuner0.json')

        class BTuner(kt.BayesianOptimization):
            def run_trial(self, trial, *args, **kwargs):
                hp = trial.hyperparameters

                batch_size = hp.Choice('batch_size', [32, 64, 128])
                epochs = hp.Int('epochs', 30, 100, step=10)

                return super().run_trial(
                    trial,
                    *args,
                    batch_size=batch_size,
                    epochs=epochs,
                    **kwargs,
                )

        def build_model(hp):
            model = Sequential()
            model.add(Input(shape=(X_train.shape[1],)))

            n_layers = 5

            for i in range(1, n_layers + 1):
                hp_units = hp.Choice(f'unit_{i}', [32, 64, 125, 256, 512, 1024])
                hp_actif = hp.Choice(f'acti_{i}',
                                     ['relu', 'tanh', 'leaky_relu', 'swish'])
                model.add(Dense(units=hp_units))
                if hp_actif == 'leaky_relu':
                    model.add(LeakyReLU(
                        negative_slope=hp.Float(f'neg_slope_{i}', 0.1, 0.3)
                    ))
                elif hp_actif == 'swish':
                    model.add(Activation(swish))
                else :
                    model.add(Activation(hp_actif))

            model.add(Dense(units=1,
                            activation=hp.Choice('acti_output',
                                                 ['linear', 'relu'])))

            model.compile(
                optimizer=Adam(learning_rate=0.001),
                loss='mse',
                metrics=['mae'],
            )
            return model

        tuner = BTuner(
            hypermodel=build_model,
            objective=kt.Objective('val_loss', direction='min'),
            max_trials=n_iter,
            project_name='bayesianOptimization_NN_model',
            overwrite=True,
        )

        tuner.search(
            X_train, y_train,
            validation_split=0.2,
            shuffle=True,
            callbacks=[keras.callbacks.EarlyStopping(patience=5)],
            verbose=0,
        )

        ## load stored model
        # model_dir = os.path.join(os.getcwd(), 'models')
        # NN_model = load_model(os.path.join(model_dir, 'NN_model.keras'))

        ## get best model from tuner
        NN_model = tuner.get_best_models(num_models=1)[0]

        ## show best model summary
        # NN_model.summary()

        ## evaluate best model
        # loss, mae = NN_model.evaluate(X_test_, y_test, verbose=0)
        # print(f'mae: {mae}')

        ## get best parameters from tuner
        NN_hyperparms = tuner.get_best_hyperparameters(num_trials=1)[0].values

        ## use best model to predict
        y_pred_NN = NN_model.predict(X_test, verbose=-1)
        store_models(NN_model,
                     y_pred_NN,
                     f"NN_model{'_poly' if use_poly else ''}",
                     NN_hyperparms)

    func_to_run = [
        ('Linear Model', linear_model_training),
        ('Ridge Model', ridge_model_training),
        ('Lasso Model', lasso_model_training),
        ('Elastic Model', elastic_model_training),
        ('SGD Model', SGD_model_training),
        ('RandomForest Model', randomForest_model_training),
        ('XGBRandomForest Model', XGBRandomForest_model_training),
        ('LGBM Model', LGBM_model_training),
        ('NN Model', NN_model_training),
    ]

    for name, func in tqdm(func_to_run, desc="Model Selection", ncols=80):
        # tqdm.write(f"{name} training ...")
        func()

    ## get the model with the minimum mae
    best_of_all_model = min(models_storage.values(), key=lambda x: x['mae'])['model']
    best_model_name = min(models_storage.keys(), key=lambda x: models_storage[x]['mae'])

    y_pred = best_of_all_model.predict(X_test)
        
    # print(f'best model: {best_model_name}')
    # print(f'    mse: {mean_squared_error(y_test, y_pred)}')
    # print(f'    mae: {mean_absolute_error(y_test, y_pred)}')

    return best_of_all_model, best_model_name


def save_model(model, model_name: str) -> None:

    os.makedirs(name='best_performance', mode=0o755, exist_ok=True)
    model_store_dir = os.path.join(os.getcwd(), 'best_performance')

    if 'NN' in model_name:
        # keras save
        model.save(f'best_performance/{model_name}.keras')
    else :
        joblib.dump(model, f'best_performance/{model_name}.joblib')
        


if __name__ == "__main__":
    
    from data_cleansing import cleaning_data
    from data_spliting import spliting_data
    from data_preprocessing import preprocess_data

    ## load csv 
    FILE_NAME = "../Salary_Data.csv"
    df = pd.read_csv(FILE_NAME, delimiter=',')
    df = cleaning_data(df, has_target_columns=True)

    X_train, X_test, y_train, y_test = spliting_data(df)

    X_train_, X_test_ = preprocess_data(X_train, y_train, X_test,
                                        use_polynomial=False)


    best_model, best_model_name = model_select(X_train_, y_train,
                                               X_test_, y_test,
                                               use_poly=False)
    save_model(best_model, best_model_name)

    shutil.rmtree('best_performance')