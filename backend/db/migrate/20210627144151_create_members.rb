class CreateMembers < ActiveRecord::Migration[6.1]
  def change
    create_table :members do |t|
      t.boolean :accepted, null: false, default: false
      t.belongs_to :user, foreign_key: { to_table: 'users1' }
      t.belongs_to :group

      t.timestamps
    end
    add_index :members, [:user_id, :group_id], unique: true
  end
end
