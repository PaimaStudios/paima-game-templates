import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@src/main";
import type MainController from "@src/MainController";

import { RatingCard } from "@src/components/RatingCard";

const UserStats: React.FC = () => {
  const mainController: MainController = useContext(AppContext);
  const [rating, setRating] = useState<number>();
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const response = await mainController.getStats();
      setRating(response.stats?.rating);
      setRank(response.rank?.toString());
      setLoading(false);
    };

    fetchStats();
  }, []);

  return <RatingCard rating={rating ?? 0} rank={rank} loading={loading} />;
};

export default UserStats;
