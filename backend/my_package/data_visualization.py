import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from typing import Literal

def show_plot(df, col, *,
              group_method: Literal['mean', 'median', 'mode'] = 'mean'):
    ## create images directory 
    images_dir = os.path.join(os.getcwd(), 'images')
    os.makedirs(images_dir, exist_ok=True)

    title_ = col

    ## show distribution
    if col == 'job_title':
        plt.xticks(rotation=90)

        # group jobs that less than 45
        threshold = 45
        temp_df = df[[col, 'salary']]
        job_counts = temp_df[col].value_counts()
        valid_jobs = job_counts[job_counts > threshold].index

        # change jobs lower than threshold name to 'Other'
        temp_df.loc[:, col] = (
            temp_df[col]
            .where(temp_df[col].isin(valid_jobs), other='Other')
        )

        plot_df = (
            temp_df
            .groupby([col], observed=True).salary
            .agg(count='count',
                 mean='mean',
                 median=lambda x: x.median(),
                 mode=lambda x: x.mode().mean(),)
        )

        # place row: Other at the end
        plot_df = pd.concat([
            plot_df.drop('Other'),
            plot_df.loc[['Other'], :]
        ])

        # plot barplot
        bars = sns.barplot(data=plot_df['count'],
                           color=(0.4, 0.9, 0.9),
                           edgecolor='black',
                           saturation=1,
                           alpha=0.8,
                           width=1)
        bars.margins(x=0.05)

    else :
        # plot histgram
        bars = sns.histplot(data=df,
                            x=col,
                            color=(0.4, 0.9, 0.9),
                            alpha=0.8)

    ## indicate number on bar
    for bar in bars.patches:
        bbox = bar.get_bbox()
        x0 = bbox.x0
        width = bbox.width
        height = bbox.y1 - bbox.y0
        x_position = x0 + width / 2
        bars.text(x=x_position, y=height + 10,
                  s=f"{int(height)}",
                  ha='center',
                  fontsize=6)

    if '_' not in title_:
        title_ = title_[0].upper() + title_[1:]
    else :
        title_ = " ".join([n_split.capitalize()
                           if n_split != 'of'
                           else n_split
                           for n_split in title_.split('_')])

    plt.xlabel('')
    plt.ylabel('Count')
    plt.title(f"{title_}")
    plt.tight_layout()

    ## save image
    plt.savefig(os.path.join(images_dir, f'{col}_histogram.png'),
                bbox_inches='tight')

    ## plot image
    plt.show()

    ################## Group Mean Salary ##################

    if col == 'salary':
        return

    ## get feature mean|median|mode with target feature
    group_df = (
        df
        .groupby([col], observed=True).salary
        .agg(mean='mean',
             median=lambda x: x.median(),
             mode=lambda x: x.mode().mean())
    )

    if col == 'job_title':
        plt.xticks(rotation=90)
        group_df = plot_df

    plt.bar(group_df.index,
            group_df[group_method],
            width=1,
            color=(0.9, 0.4, 0.9),
            edgecolor='black',
            alpha=0.8)

    plt.xlabel('')
    plt.ylabel(f"Group {group_method} salary")
    plt.title(title_)
    plt.tight_layout()

    ## save image
    fig_name = f'{col}_group{group_method.capitalize()}_salary.png'
    plt.savefig(os.path.join(images_dir, fig_name), bbox_inches='tight')

    ## plot image
    plt.show()


def show_heatmap(X_train: pd.DataFrame,
                 y_train: pd.DataFrame,
                 use_poly: bool = False) -> None:
    ## create images directory 
    images_dir = os.path.join(os.getcwd(), 'images')
    os.makedirs(images_dir, exist_ok=True)

    X_train['salary'] = y_train

    annot_size = 10
    if use_poly:
        annot_size = 7

    plt.figure(figsize=(10, 10))
    sns.heatmap(X_train.corr(),
                annot=True,
                cmap='coolwarm',
                annot_kws={'size': annot_size})

    plt.tight_layout()
    

    ## save fig
    fig_name = 'features_heatmap_poly.png' \
                if use_poly \
                else 'features_heatmap.png'

    plt.savefig(os.path.join(images_dir, fig_name), bbox_inches='tight')

    ## show fig
    plt.show()



if __name__ == "__main__":
    import os
    import shutil

    from data_cleansing import cleaning_data

    ## load csv 
    FILE_NAME = "../Salary_Data.csv"
    df = pd.read_csv(FILE_NAME, delimiter=',')
    df = cleaning_data(df, has_target_columns=True)
    
    images_dir = os.path.join(os.getcwd(), 'images')
    os.makedirs(images_dir, exist_ok=True)

    # test 1
    for col in df.columns:
        show_plot(df, col, group_method='median')


    from data_spliting import spliting_data
    from data_preprocessing import preprocess_data

    X_train, X_test, y_train, y_test = spliting_data(df)
    # test 2
    X_train_, X_test_ = preprocess_data(X_train, y_train, X_test, use_polynomial=True)
    show_heatmap(X_train_, y_train, use_poly=True)
    # test 3
    X_train_, X_test_ = preprocess_data(X_train, y_train, X_test, use_polynomial=False)
    show_heatmap(X_train_, y_train, use_poly=False)

    shutil.rmtree(images_dir)