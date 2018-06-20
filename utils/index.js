const createUserLookup = (articleData, userDocs) => {
    return articleData.reduce((acc, {created_by}) => {
        acc[created_by] = userDocs.find(doc => doc.username === created_by)._id
        return acc
    }, {})
}

const formatArticleData = (articleData, userLookup) => {
    return articleData.map(articleDatum => {
        const {topic, created_by} = articleDatum
        return {...articleDatum, created_by: userLookup[created_by], belongs_to: topic}
    })
}

const createArticleLookup = (commentData, articleDocs) => {
    return commentData.reduce((acc, {belongs_to}) => {
        acc[belongs_to] = articleDocs.find(articleDoc => articleDoc.title === belongs_to)._id
        return acc
    }, {})
}

const formatCommentData = (commentData, userLookup, articleLookup) => {
    return commentData.map(commentDatum => {
        const {created_by, belongs_to} = commentDatum
        return {
            ...commentDatum,
            created_by: userLookup[created_by],
            belongs_to: articleLookup[belongs_to]
        }
    })
}


module.exports = {formatArticleData, createUserLookup, formatCommentData, createArticleLookup}