const getAverageRatings = (data) => {
  let competentAvg =
    data.reduce((sum, rating) => sum + (rating.competent_rating * 10) / 3, 0) /
      data.length || 0;
  competentAvg = competentAvg.toFixed(1);
  let likableAvg =
    data.reduce((sum, rating) => sum + (rating.likable_rating * 10) / 3, 0) /
      data.length || 0;
  likableAvg = likableAvg.toFixed(1);
  let influentialAvg =
    data.reduce(
      (sum, rating) => sum + (rating.influential_rating * 10) / 3,
      0
    ) / data.length || 0;
  influentialAvg = influentialAvg.toFixed(1);
  return {
    competentAvg,
    likableAvg,
    influentialAvg,
  };
};

module.exports = getAverageRatings;
