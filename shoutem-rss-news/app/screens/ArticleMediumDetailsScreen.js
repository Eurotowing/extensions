import React from 'react';
import { connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Image,
  Tile,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  RichMedia,
} from '@shoutem/ui-addons';

import * as _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';

import { ext } from '../const';
import NextArticle from '../components/NextArticle';

import { getLeadImageUrl, getAttachments } from 'shoutem.rss';
import { getNewsFeed } from '../redux';

class ArticleMediumDetailsScreen extends React.Component {
  static propTypes = {
    // The news article to display
    article: React.PropTypes.object.isRequired,
    // News articles collection being displayed
    articles: React.PropTypes.array,
    // A function for configuring the navigation bar
    openNextArticle: React.PropTypes.func,
    // The URL of the feed that the article belongs to, this
    // prop is only necessary if the showNext is true
    feedUrl: React.PropTypes.string,
    // Whether the inline gallery should be displayed on the
    // details screen. Inline gallery displays the image
    // attachments that are not directly referenced in the
    // article body.
  };

  getNavBarProps() {
    const { article } = this.props;
    return {
      styleName: getLeadImageUrl(article) ? 'clear' : 'no-border',
      animationName: getLeadImageUrl(article) ? 'solidify' : '',
      share: {
        title: article.title,
        link: article.link,
      },
    };
  }

  shouldRenderNextArticle() {
    return this.props.articles && this.props.openNextArticle;
  }

  renderUpNext() {
    const { article: { id }, articles, openNextArticle } = this.props;
    const currentArticleIndex = _.findIndex(articles, { id });

    const nextArticle = articles[currentArticleIndex + 1];
    if (nextArticle) {
      return (
        <NextArticle
          article={nextArticle}
          openNextArticle={openNextArticle}
        />
      );
    }
    return null;
  }

  renderImage() {
    const { article } = this.props;
    return getLeadImageUrl(article) ? (
      <Image
        animationName="hero"
        styleName="large"
        source={{ uri: getLeadImageUrl(article) }}
      />) : null;
  }

  render() {
    const { article } = this.props;
    const screenStyle = getLeadImageUrl(article) ? 'full-screen paper' : 'paper';
    const dateFormat = moment(article.timeUpdated).isBefore(0) ?
    null : (<Caption styleName="md-gutter-left">{moment(article.timeUpdated).fromNow()}</Caption>);

    return (
      <Screen styleName={screenStyle}>
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderImage()}
          <View styleName="solid">
            <Tile styleName="text-centric md-gutter-bottom xl-gutter-bottom">
              <Title>{article.title.toUpperCase()}</Title>

              <View styleName="horizontal md-gutter-top">
                <Caption numberOfLines={1}>{article.newsAuthor}</Caption>
                {dateFormat}
              </View>
            </Tile>
            <RichMedia
              body={article.body}
              attachments={getAttachments(article)}
            />
            {this.shouldRenderNextArticle() && this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect((state, ownProps) => ({
  articles: getNewsFeed(state, ownProps.feedUrl),
}))(connectStyle(ext('ArticleMediumDetailsScreen'))(ArticleMediumDetailsScreen));
