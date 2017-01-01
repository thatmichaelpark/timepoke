select member_name, is_active, array_to_string(array_agg((shop_name, hours, items_array)), ', ') as results
from
  (
    select members.name as member_name, member_id, members.is_active, shops.name as shop_name, shop_id, sum(hours) as hours
    from
      members,
      entries,
      shops
    where members.id = entries.member_id
      and entries.shop_id = shops.id
    group by members.name, member_id, members.is_active, shops.name, shop_id
  ) items
left join
  (
    select member_id, item_sums.shop_id, array_to_string(array_agg((items.name, sum)), ', ') as items_array
    from
      (
        select member_id, shop_id, item_id, sum(quantity)
        from
          entries,
          entries_items
        where entries.id = entry_id
        group by member_id, shop_id, item_id
        order by member_id, shop_id, item_id
      ) item_sums,
      items
    where item_sums.item_id = items.id
    group by member_id, item_sums.shop_id
  ) hours
on items.member_id = hours.member_id
  and items.shop_id = hours.shop_id
group by member_name, is_active
order by member_name


    -- select members.name, shops.name, hours, entries_items.name, quantity
    -- from
    --   members,
    --   shops,
    --   entries
    -- left join
    --   (
    --     select *
    --     from
    --       entries_items,
    --       items
    --   ) entries_items
    -- on entries.id = entries_items.entry_id


-- select array_to_string(array_agg((item_id, sum)), ','), member_id
-- from
--   (
--     select member_id, min(shop_id) as shop_id, min(hours) as hours, item_id, sum(quantity)
--     from
--       entries
--     left join
--       entries_items
--     on entries.id = entries_items.entry_id
--     group by member_id, item_id
--     order by member_id, shop_id
--   ) items
-- group by member_id

;
