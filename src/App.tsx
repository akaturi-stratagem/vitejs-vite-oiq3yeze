import React, { useState, useEffect, useMemo } from 'react';

export default function MealMacroCalculator() {
  const safeLoadStorage = (key: string, fallback: any) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const safeSaveStorage = (key: string, value: any) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  };

  const defaultDiets = [
    {
      id: 'standard',
      name: 'Standard (Sep 26)',
      description: 'Your regular balanced daily meal plan with Oats, Protein, Dal, Quinoa, and Snacks.',
      categories: [
        {
          id: 'breakfast',
          name: '1. Breakfast',
          items: [
            { id: 'b1', name: 'Vanilla Ice Cream Gold Standard Whey', portion: '1 scoop', grams: 30, cal: 120, p: 24, c: 3, f: 15, active: true },
            { id: 'b2', name: 'Blueberries', portion: '0.5 cup', grams: 75, cal: 41, p: 1, c: 10, f: 0, active: true },
            { id: 'b3', name: 'Chia Seeds', portion: '1 tbsp', grams: 12, cal: 60, p: 2, c: 5, f: 4, active: true },
            { id: 'b4', name: 'Oats', portion: '0.5 cup', grams: 40, cal: 150, p: 5, c: 27, f: 3, active: true },
            { id: 'b5', name: 'Organic Eggs & Egg Whites', portion: 'Optional Swap', grams: 100, cal: 75, p: 12, c: 1, f: 5, active: false }
          ]
        },
        {
          id: 'lunch',
          name: '2. Lunch',
          items: [
            { id: 'l1', name: 'Moong Dal', portion: '0.25 cup', grams: 50, cal: 120, p: 8, c: 21, f: 0, active: true },
            { id: 'l2', name: 'Quinoa', portion: '0.5 cup', grams: 90, cal: 95, p: 4, c: 17, f: 1, active: true },
            { id: 'l3', name: 'Traditional Seitan', portion: '2 oz', grams: 56, cal: 100, p: 18, c: 3, f: 1, active: true }
          ]
        },
        {
          id: 'preworkout',
          name: '3. Pre-Workout',
          items: [
            { id: 'pw1', name: 'Coffee Milk Shake Ultra-Filtered', portion: '1 can', grams: 330, cal: 150, p: 20, c: 12, f: 2, active: true },
            { id: 'pw2', name: 'Almond Milk', portion: '1 serving', grams: 240, cal: 60, p: 1, c: 2, f: 5, active: true },
            { id: 'pw3', name: 'Vanilla Syrup', portion: '1 serving', grams: 30, cal: 80, p: 0, c: 21, f: 0, active: true },
            { id: 'pw4', name: 'Dates', portion: '2 pieces', grams: 24, cal: 46, p: 0, c: 12, f: 0, active: true },
            { id: 'pw5', name: 'Fig Bar', portion: '1 bar', grams: 50, cal: 200, p: 2, c: 38, f: 4, active: false }
          ]
        },
        {
          id: 'postworkout',
          name: '4. Post-Workout',
          items: [
            { id: 'pow1', name: 'Gold Standard Whey Protein', portion: '1 scoop', grams: 30, cal: 120, p: 24, c: 3, f: 1, active: true },
            { id: 'pow2', name: 'Organic Greek Yogurt, Plain', portion: '0.67 cup', grams: 150, cal: 100, p: 15, c: 6, f: 0, active: true },
            { id: 'pow3', name: 'Cottage Cheese, Small Curd 4%', portion: '0.5 cup', grams: 110, cal: 110, p: 14, c: 4, f: 5, active: true },
            { id: 'pow4', name: 'Potatoes', portion: '1 serving', grams: 100, cal: 80, p: 2, c: 18, f: 0, active: true }
          ]
        },
        {
          id: 'dinner',
          name: '5. Dinner',
          items: [
            { id: 'd1', name: 'Tofu', portion: '75 gram', grams: 75, cal: 91, p: 9, c: 2, f: 5, active: true },
            { id: 'd2', name: 'Quinoa', portion: '0.4 cup', grams: 70, cal: 76, p: 3, c: 14, f: 1, active: true },
            { id: 'd3', name: 'Zucchini', portion: '100 gram', grams: 100, cal: 16, p: 1, c: 3, f: 0, active: true },
            { id: 'd4', name: 'Grapes', portion: '30 pieces', grams: 100, cal: 90, p: 1, c: 23, f: 0, active: true },
            { id: 'd5', name: 'Cashew Brown Sugar Brittle', portion: '1 piece', grams: 10, cal: 35, p: 1, c: 5, f: 1, active: true },
            { id: 'd6', name: 'Native Fuel Micellar Casein Choc-PB', portion: '0.6 scoop', grams: 25, cal: 84, p: 15, c: 2, f: 1, active: true },
            { id: 'd7', name: 'Soft Silken Tofu', portion: '80 gram', grams: 80, cal: 44, p: 5, c: 1, f: 2, active: true }
          ]
        }
      ]
    },
    {
      id: 'keto',
      name: 'Keto (Oct 9)',
      description: 'Low carb, high fat diet featuring eggs, egg whites, cabbage stir-fry, salmon, and avocado.',
      categories: [
        {
          id: 'breakfast',
          name: '1. Breakfast',
          items: [
            { id: 'kb1', name: 'Egg Whites', portion: '15 tbsp', grams: 225, cal: 125, p: 26, c: 2, f: 0, active: true },
            { id: 'kb2', name: 'Organic Eggs', portion: '1 serving', grams: 50, cal: 62, p: 6, c: 0, f: 5, active: true },
            { id: 'kb3', name: 'Goat Cheese, Plain', portion: '10 gram', grams: 10, cal: 25, p: 2, c: 0, f: 2, active: true },
            { id: 'kb4', name: 'Traditional Seitan', portion: '2 oz', grams: 56, cal: 100, p: 18, c: 3, f: 1, active: true },
            { id: 'kb5', name: 'White Cabbage', portion: '120 gram', grams: 120, cal: 38, p: 2, c: 7, f: 0, active: true }
          ]
        },
        {
          id: 'lunch',
          name: '2. Lunch',
          items: [
            { id: 'kl1', name: 'Salmon', portion: '120 gram', grams: 120, cal: 175, p: 25, c: 0, f: 8, active: true },
            { id: 'kl2', name: 'Zucchini', portion: '99.2 gram', grams: 99, cal: 16, p: 1, c: 3, f: 0, active: true },
            { id: 'kl3', name: 'Cauliflower (Frozen)', portion: '100 gram', grams: 100, cal: 24, p: 2, c: 5, f: 0, active: true }
          ]
        },
        {
          id: 'preworkout',
          name: '3. Pre-Workout',
          items: [
            { id: 'kpw1', name: 'Almond Butter', portion: '1 serving', grams: 32, cal: 180, p: 6, c: 6, f: 16, active: true },
            { id: 'kpw2', name: 'Walnuts', portion: '20 gram', grams: 20, cal: 130, p: 3, c: 3, f: 13, active: true },
            { id: 'kpw3', name: 'Extra Virgin Olive Oil', portion: '1 tbsp', grams: 14, cal: 122, p: 0, c: 0, f: 14, active: true },
            { id: 'kpw4', name: 'Chia Seeds', portion: '1 tbsp', grams: 12, cal: 60, p: 2, c: 5, f: 4, active: true }
          ]
        },
        {
          id: 'postworkout',
          name: '4. Post-Workout',
          items: [
            { id: 'kpow1', name: 'Zero Carb Protein Powder, Banana Cream', portion: '1 scoop', grams: 30, cal: 100, p: 25, c: 0, f: 0, active: true },
            { id: 'kpow2', name: 'Organic Greek Yogurt, Plain', portion: '0.67 cup', grams: 150, cal: 100, p: 15, c: 6, f: 0, active: true },
            { id: 'kpow3', name: 'Soft Silken Tofu', portion: '80 gram', grams: 80, cal: 44, p: 5, c: 1, f: 2, active: true },
            { id: 'kpow4', name: 'Frozen Raspberries', portion: '20 gram', grams: 20, cal: 21, p: 0, c: 5, f: 0, active: true }
          ]
        },
        {
          id: 'dinner',
          name: '5. Dinner',
          items: [
            { id: 'kd1', name: 'Portuguese Grilled Chicken Breast', portion: '115 gram', grams: 115, cal: 190, p: 32, c: 1, f: 5, active: true },
            { id: 'kd2', name: 'Avocado', portion: '70 gram', grams: 70, cal: 139, p: 2, c: 6, f: 13, active: true },
            { id: 'kd3', name: 'Whey Protein', portion: '1 serving', grams: 30, cal: 100, p: 20, c: 2, f: 1, active: true },
            { id: 'kd4', name: 'Cauliflower (Frozen)', portion: '100 gram', grams: 100, cal: 24, p: 2, c: 5, f: 0, active: true },
            { id: 'kd5', name: 'Zucchini', portion: '99 gram', grams: 99, cal: 16, p: 1, c: 3, f: 0, active: true }
          ]
        }
      ]
    },
    {
      id: 'intermittent',
      name: 'Intermittent Fasting (16:8)',
      description: 'Same core meals as standard plan, scheduled within an eating window.',
      categories: [
        {
          id: 'breakfast',
          name: '1. Breakfast (First Meal @ 12 PM)',
          items: [
            { id: 'if1', name: 'Vanilla Ice Cream Gold Standard Whey', portion: '1 scoop', grams: 30, cal: 120, p: 24, c: 3, f: 1, active: true },
            { id: 'if2', name: 'Blueberries & Chia Seeds Bowl', portion: '1 serving', grams: 87, cal: 101, p: 3, c: 15, f: 4, active: true },
            { id: 'if3', name: 'Oats', portion: '0.5 cup', grams: 40, cal: 150, p: 5, c: 27, f: 3, active: true }
          ]
        },
        {
          id: 'lunch',
          name: '2. Lunch',
          items: [
            { id: 'ifl1', name: 'Moong Dal & Quinoa', portion: 'Standard portion', grams: 140, cal: 215, p: 12, c: 38, f: 1, active: true },
            { id: 'ifl2', name: 'Traditional Seitan', portion: '2 oz', grams: 56, cal: 100, p: 18, c: 3, f: 1, active: true }
          ]
        },
        {
          id: 'preworkout',
          name: '3. Pre-Workout',
          items: [
            { id: 'ifpw1', name: 'Coffee Milk Shake & Dates', portion: '1 serving', grams: 350, cal: 196, p: 20, c: 24, f: 2, active: true }
          ]
        },
        {
          id: 'postworkout',
          name: '4. Post-Workout',
          items: [
            { id: 'ifpow1', name: 'Greek Yogurt & Cottage Cheese Mix', portion: '1 serving', grams: 260, cal: 210, p: 29, c: 10, f: 5, active: true }
          ]
        },
        {
          id: 'dinner',
          name: '5. Dinner (Last Meal before 8 PM)',
          items: [
            { id: 'ifd1', name: 'Tofu & Zucchini Stir Fry', portion: '1 serving', grams: 245, cal: 211, p: 17, c: 20, f: 8, active: true },
            { id: 'ifd2', name: 'Casein Protein & Grapes', portion: '1 serving', grams: 125, cal: 174, p: 16, c: 25, f: 1, active: true }
          ]
        }
      ]
    }
  ];

  const [activeDietId, setActiveDietId] = useState(() => safeLoadStorage('activeDietId', 'standard'));
  const [diets, setDiets] = useState(() => safeLoadStorage('stapleDiets', defaultDiets));
  const [customWeights, setCustomWeights] = useState<Record<string, number>>({});
  const [targets, setTargets] = useState(() => safeLoadStorage('stapleTargets', { cal: 2200, p: 160, c: 200, f: 65 }));
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState('breakfast');
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [historyLogs, setHistoryLogs] = useState(() => safeLoadStorage('stapleHistory', []));
  const [toast, setToast] = useState('');

  const [newName, setNewName] = useState('');
  const [newPortion, setNewPortion] = useState('1 serving');
  const [newGrams, setNewGrams] = useState(100);
  const [newCal, setNewCal] = useState(150);
  const [newP, setNewP] = useState(15);
  const [newC, setNewC] = useState(15);
  const [newF, setNewF] = useState(5);

  useEffect(() => { safeSaveStorage('activeDietId', activeDietId); }, [activeDietId]);
  useEffect(() => { safeSaveStorage('stapleDiets', diets); }, [diets]);
  useEffect(() => { safeSaveStorage('stapleTargets', targets); }, [targets]);
  useEffect(() => { safeSaveStorage('stapleHistory', historyLogs); }, [historyLogs]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const currentDiet = diets.find((d: any) => d.id === activeDietId) || diets[0];

  const getItemWeight = (item: any) => {
    return customWeights[item.id] !== undefined ? customWeights[item.id] : item.grams;
  };

  const totals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0;
    currentDiet.categories.forEach((cat: any) => {
      cat.items.forEach((item: any) => {
        if (item.active) {
          const currentWeight = getItemWeight(item);
          const ratio = item.grams > 0 ? currentWeight / item.grams : 1;
          cal += Math.round(item.cal * ratio);
          p += Math.round(item.p * ratio);
          c += Math.round(item.c * ratio);
          f += Math.round(item.f * ratio);
        }
      });
    });
    return { cal, p, c, f };
  }, [currentDiet, customWeights]);

  const toggleItem = (catId: string, itemId: string) => {
    setDiets((prev: any) => prev.map((diet: any) => {
      if (diet.id !== activeDietId) return diet;
      return {
        ...diet,
        categories: diet.categories.map((cat: any) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            items: cat.items.map((item: any) => item.id === itemId ? { ...item, active: !item.active } : item)
          };
        })
      };
    }));
  };

  const updateWeight = (itemId: string, val: string) => {
    const num = Number(val);
    setCustomWeights(prev => ({ ...prev, [itemId]: isNaN(num) ? 0 : Math.max(0, num) }));
  };

  const removeItem = (catId: string, itemId: string) => {
    setDiets((prev: any) => prev.map((diet: any) => {
      if (diet.id !== activeDietId) return diet;
      return {
        ...diet,
        categories: diet.categories.map((cat: any) => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            items: cat.items.filter((item: any) => item.id !== itemId)
          };
        })
      };
    }));
    showToastMsg('Item removed from plan.');
  };

  const addCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newItem = {
      id: 'custom_' + Date.now(),
      name: newName,
      portion: newPortion,
      grams: Number(newGrams),
      cal: Number(newCal),
      p: Number(newP),
      c: Number(newC),
      f: Number(newF),
      active: true
    };

    setDiets((prev: any) => prev.map((diet: any) => {
      if (diet.id !== activeDietId) return diet;
      return {
        ...diet,
        categories: diet.categories.map((cat: any) => {
          if (cat.id !== targetCategory) return cat;
          return { ...cat, items: [...cat.items, newItem] };
        })
      };
    }));

    setNewName('');
    setShowAddModal(false);
    showToastMsg('Successfully added ' + newName + '!');
  };

  const saveTodayToHistory = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: todayStr,
      dietName: currentDiet.name,
      ...totals
    };
    setHistoryLogs((prev: any) => [newEntry, ...prev.filter((h: any) => h.date !== todayStr)]);
    showToastMsg('Today saved to history logs!');
  };

  const exportBackupJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ diets, targets, historyLogs }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ashwin_tracker_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToastMsg('Backup JSON downloaded successfully!');
  };

  const importBackupJSON = (e: any) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event: any) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.diets) setDiets(parsed.diets);
          if (parsed.targets) setTargets(parsed.targets);
          if (parsed.historyLogs) setHistoryLogs(parsed.historyLogs);
          showToastMsg('Backup imported successfully!');
        } catch (err) {
          alert('Invalid backup file format.');
        }
      };
    }
  };

  const exportCSV = () => {
    let csv = 'Category,Food Item,Portion,Weight(g),Calories,Protein(g),Carbs(g),Fat(g)\n';
    currentDiet.categories.forEach((cat: any) => {
      cat.items.forEach((item: any) => {
        if (item.active) {
          const currentWeight = getItemWeight(item);
          const ratio = item.grams > 0 ? currentWeight / item.grams : 1;
          csv += `"${cat.name}","${item.name}","${item.portion}",${currentWeight},${Math.round(item.cal * ratio)},${Math.round(item.p * ratio)},${Math.round(item.c * ratio)},${Math.round(item.f * ratio)}\n`;
        }
      });
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ashwin_tracker_${currentDiet.id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToastMsg('CSV Spreadsheet exported!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {toast && (
          <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 animate-bounce">
            <span className="font-medium text-sm">{toast}</span>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl text-lg font-black">🥗</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Ashwin's Daily Tracker</h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">Manage your consistent daily staples, enter exact gram weights, and track macros effortlessly.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowPasteModal(true)} 
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
            >
              <span>💾 Backup / Sync</span>
            </button>
            <button 
              onClick={() => setShowReportsModal(true)} 
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 transition flex items-center space-x-1.5"
            >
              <span>📊 Reports & History</span>
            </button>
            <button 
              onClick={exportCSV} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-900/40"
            >
              <span>📥 Export CSV</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {diets.map((diet: any) => {
            const isActive = diet.id === activeDietId;
            return (
              <div 
                key={diet.id}
                onClick={() => setActiveDietId(diet.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  isActive 
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-emerald-500 shadow-xl shadow-emerald-950/50 ring-2 ring-emerald-500/30' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-base ${isActive ? 'text-emerald-400' : 'text-white'}`}>{diet.name}</h3>
                    {isActive && <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full">ACTIVE</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{diet.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>5 Meal Categories</span>
                  <span className="text-emerald-400 font-medium">Switch Plan →</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Current Plan Summary</span>
              <h2 className="text-xl font-black text-white mt-0.5">{currentDiet.name}</h2>
            </div>
            <button 
              onClick={saveTodayToHistory}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center space-x-1.5"
            >
              <span>✨ Save Day to History Log</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Calories</span>
                <span className="text-slate-300">Target: {targets.cal}</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">{totals.cal} <span className="text-xs font-normal text-slate-400">kcal</span></div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${totals.cal > targets.cal ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(100, (totals.cal / targets.cal) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Protein</span>
                <span className="text-slate-300">Target: {targets.p}g</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{totals.p} <span className="text-xs font-normal text-slate-400">g</span></div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (totals.p / targets.p) * 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Carbs</span>
                <span className="text-slate-300">Target: {targets.c}g</span>
              </div>
              <div className="text-2xl font-black text-cyan-400 mt-1">{totals.c} <span className="text-xs font-normal text-slate-400">g</span></div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, (totals.c / targets.c) * 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Fat</span>
                <span className="text-slate-300">Target: {targets.f}g</span>
              </div>
              <div className="text-2xl font-black text-rose-400 mt-1">{totals.f} <span className="text-xs font-normal text-slate-400">g</span></div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (totals.f / targets.f) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {currentDiet.categories.map((cat: any) => {
            const catCals = cat.items.reduce((acc: number, item: any) => {
              if (!item.active) return acc;
              const w = getItemWeight(item);
              const r = item.grams > 0 ? w / item.grams : 1;
              return acc + Math.round(item.cal * r);
            }, 0);

            const catProtein = cat.items.reduce((acc: number, item: any) => {
              if (!item.active) return acc;
              const w = getItemWeight(item);
              const r = item.grams > 0 ? w / item.grams : 1;
              return acc + Math.round(item.p * r);
            }, 0);

            return (
              <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-black text-lg text-white">{cat.name}</h3>
                    <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 font-medium border border-slate-700/60">
                      {catCals} kcal | {catProtein}g Protein
                    </span>
                  </div>
                  <button 
                    onClick={() => { setTargetCategory(cat.id); setShowAddModal(true); }}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/30 transition flex items-center space-x-1"
                  >
                    <span>+ Add Food</span>
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {cat.items.map((item: any) => {
                    const currentWeight = getItemWeight(item);
                    const ratio = item.grams > 0 ? currentWeight / item.grams : 1;
                    const itemCal = Math.round(item.cal * ratio);
                    const itemP = Math.round(item.p * ratio);
                    const itemC = Math.round(item.c * ratio);
                    const itemF = Math.round(item.f * ratio);

                    return (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          item.active 
                            ? 'bg-slate-950/70 border-slate-800 shadow-md' 
                            : 'bg-slate-950/20 border-slate-900 opacity-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button 
                            onClick={() => toggleItem(cat.id, item.id)}
                            className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                              item.active 
                                ? 'bg-emerald-600 border-emerald-500 text-white font-bold' 
                                : 'bg-slate-800 border-slate-700 text-transparent'
                            }`}
                          >
                            ✓
                          </button>
                          <div>
                            <div className="font-bold text-sm text-white flex items-center space-x-2">
                              <span>{item.name}</span>
                              <span className="text-xs font-normal text-slate-400">({item.portion})</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                              <span>🔥 {itemCal} kcal</span>
                              <span className="text-emerald-400">P: {itemP}g</span>
                              <span className="text-cyan-400">C: {itemC}g</span>
                              <span className="text-rose-400">F: {itemF}g</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 justify-end">
                          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                            <span className="text-xs text-slate-400 font-medium">Weight:</span>
                            <input 
                              type="number" 
                              value={currentWeight}
                              onChange={(e) => updateWeight(item.id, e.target.value)}
                              className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-emerald-500"
                            />
                            <span className="text-xs text-slate-400">g</span>
                          </div>

                          <button 
                            onClick={() => removeItem(cat.id, item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition"
                            title="Remove food item"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-white">Add Custom Staple Food</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <form onSubmit={addCustomFood} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Target Meal Category</label>
                  <select 
                    value={targetCategory} 
                    onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {currentDiet.categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Food Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Greek Yogurt Bowl" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Portion Label</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 1 cup / 150g" 
                      value={newPortion}
                      onChange={(e) => setNewPortion(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Base Gram Weight</label>
                    <input 
                      type="number" 
                      value={newGrams}
                      onChange={(e) => setNewGrams(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Calories (kcal)</label>
                    <input 
                      type="number" 
                      value={newCal}
                      onChange={(e) => setNewCal(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Protein (g)</label>
                    <input 
                      type="number" 
                      value={newP}
                      onChange={(e) => setNewP(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Carbs (g)</label>
                    <input 
                      type="number" 
                      value={newC}
                      onChange={(e) => setNewC(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Fat (g)</label>
                    <input 
                      type="number" 
                      value={newF}
                      onChange={(e) => setNewF(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/40"
                  >
                    Save Staple Food
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showReportsModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h3 className="text-xl font-black text-white">📊 Saved History Logs & Reports</h3>
                <button onClick={() => setShowReportsModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-emerald-400 mb-2">Past Logged Days</h4>
                {historyLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">No days saved to history yet. Click "Save Day to History Log" on your main dashboard anytime!</p>
                ) : (
                  <div className="space-y-2">
                    {historyLogs.map((log: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{log.date}</span>
                          <span className="ml-2 text-slate-400">({log.dietName})</span>
                        </div>
                        <div className="flex space-x-4 text-slate-300 font-medium">
                          <span>🔥 {log.cal} kcal</span>
                          <span className="text-emerald-400">P: {log.p}g</span>
                          <span className="text-cyan-400">C: {log.c}g</span>
                          <span className="text-rose-400">F: {log.f}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button 
                  onClick={() => setShowReportsModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700"
                >
                  Close Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {showPasteModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-lg font-black text-white">💾 Backup & Device Sync</h3>
                <button onClick={() => setShowPasteModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <p className="text-xs text-slate-300">
                Export your entire meal plan library, history logs, and targets to a JSON file so you can transfer your app across devices in one click!
              </p>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={exportBackupJSON}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-900/40 transition"
                >
                  📥 Export Full Backup JSON
                </button>

                <div className="relative">
                  <input 
                    type="file" 
                    accept=".json"
                    onChange={importBackupJSON}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 text-center transition">
                    📂 Import Backup JSON File
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}