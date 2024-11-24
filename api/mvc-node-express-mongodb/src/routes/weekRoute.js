router.get('/week-history', async (req, res) => {
    try {
      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay(); // Jour de la semaine (0 = Dimanche, 1 = Lundi, etc.)
  
      // Calculer la date du dernier lundi (début de la semaine)
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek + 1); // Revenir au lundi
      startOfWeek.setHours(0, 0, 0, 0); // Minuit du lundi
  
      // Calculer la date du dimanche (fin de la semaine)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Ajouter 6 jours pour atteindre le dimanche
      endOfWeek.setHours(23, 59, 59, 999); // 23h59 du dimanche
  
      // Récupérer les températures entre le lundi et le dimanche
      const temperatures = await Temperature.find({
        date: { $gte: startOfWeek, $lte: endOfWeek }
      });
  
      if (temperatures.length === 0) {
        return res.status(404).json({ message: 'Aucune donnée disponible pour cette semaine.' });
      }
  
      // Organiser les températures par jour
      const weeklyData = [];
      for (let i = 0; i <= 6; i++) {
        const dayStart = new Date(startOfWeek);
        dayStart.setDate(startOfWeek.getDate() + i);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
  
        // Filtrer les températures pour ce jour
        const dailyTemps = temperatures.filter(temp => temp.date >= dayStart && temp.date <= dayEnd);
        const dailyAvgTemp = dailyTemps.reduce((acc, temp) => acc + temp.temperature, 0) / dailyTemps.length || 0;
        const dailyAvgHumidity = dailyTemps.reduce((acc, temp) => acc + temp.humidity, 0) / dailyTemps.length || 0;
  
        weeklyData.push({
          day: dayStart.toLocaleString('fr-FR', { weekday: 'long' }), // Nom du jour (Lundi, Mardi, ...)
          date: dayStart,
          averageTemperature: dailyAvgTemp,
          averageHumidity: dailyAvgHumidity
        });
      }
  
      return res.status(200).json(weeklyData);
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  